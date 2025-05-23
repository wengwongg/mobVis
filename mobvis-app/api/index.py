import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "../scripts/dmo_extraction")))
from core import *

from typing import Annotated

from fastapi import FastAPI, UploadFile, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# adding the middleware to connect between NextJS and FastAPI routes.
app = FastAPI(docs_url="/api/py/docs", openapi_url="/api/py/openapi.json")
app.add_middleware(
  CORSMiddleware,
  # NextJS runs on here.
  allow_origins=["http://localhost:3000"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"]
)

general_error_message = "No gait parameters could be extracted. Please check inputs such as: sampling rate, input CSV data format (presence of 'samples' column?), conversion to m/s² checkbox (if needed?)."
# data extraction POST route.


@app.post("/api/py/dmo_extraction")
def dmo_extraction(name: Annotated[str, Form()], description: Annotated[str, Form()], samplingRate: Annotated[int, Form()], sensorHeight: Annotated[float, Form()], patientHeight: Annotated[float, Form()], setting: Annotated[str, Form()], convertToMs: Annotated[bool, Form()], csvFile: UploadFile):
  # validation handled on the FE, TODO: future work, add validation here.
  try:
    results = extract_dmos(csvFile.file, sensorHeight, patientHeight, setting, samplingRate, convertToMs)

    # check if actual results are empty
    if (results.per_wb_parameters_.empty):
      raise ValueError(general_error_message)

    # use per_wb and per_stride parameters given from the pipeline.
    per_wb_parameters = results.per_wb_parameters_
    per_wb_parameters = per_wb_parameters.drop(columns=["rule_name", "rule_obj"]).replace(np.nan, 0)
    per_wb_parameters["wb_id"] = per_wb_parameters.index

    per_stride_parameters = results.per_stride_parameters_
    per_stride_parameters = per_stride_parameters.drop(columns=["original_gs_id"]).replace(np.nan, 0)
    # add s_id which contains wb_id but also the stride index.
    per_stride_parameters["s_id"] = per_stride_parameters.index.get_level_values("s_id")
    # adjust s_id to only include the stride index, not wb
    per_stride_parameters["s_id"] = per_stride_parameters["s_id"].apply(lambda s_id: int(s_id.split("_")[1]))
    # add corresponding wb_id to easier access strides for a wb
    per_stride_parameters["wb_id"] = per_stride_parameters.index.get_level_values("wb_id")

    # calculate aggregate params from per_wb params
    aggregate_parameters = calculate_aggregate_parameters(per_wb_parameters).replace(np.nan, 0)

    # 0 is an okay alternative for NaN because the parameters should be non-zero when calculated.
    
    response = {
      "total_walking_duration": results.aggregated_parameters_.loc["all_wbs","total_walking_duration_h"],
      "per_wb_parameters": per_wb_parameters.to_dict(orient="records"),
      "per_stride_parameters": per_stride_parameters.to_dict(orient="records"),
      "aggregate_parameters": aggregate_parameters.to_dict(orient="records")
    }

    return response
  except Exception as e:
    # handle common interpolation error involving invalid sampling rate.
    if ("x_new is below the interpolation range's minimum value" in str(e)):
      e = ValueError("The sampling rate may be too high.")

    csvFile.file.close()
    raise HTTPException(status_code=400, detail=str(e))
  finally:
    csvFile.file.close()
  
