import pandas as pd
from pathlib import Path
from mobgap.consts import GRAV_MS2
from mobgap.data import GaitDatasetFromData
from mobgap.pipeline import MobilisedPipelineImpaired, MobilisedPipelineHealthy
from mobgap.data import get_all_lab_example_data_paths

def is_valid_measurement_condition(measurement_condition: str):
  if (measurement_condition not in ["laboratory", "free_living"]):
    raise ValueError("measurement_condition must be either 'laboratory' or 'free_living'")

def load_csv(path: Path, convertAccFromGToMs: bool = False) -> pd.DataFrame:
  data = pd.read_csv(path)
  if (convertAccFromGToMs):
    data[["acc_x", "acc_y", "acc_z"]] = (data[["acc_x", "acc_y", "acc_z"]] * GRAV_MS2)
  return data

def create_dataset_from_dataframe(data: pd.DataFrame, sensor_height_m: float, height_m: float, measurement_condition: str, sampling_rate_hz = int) -> GaitDatasetFromData:
  is_valid_measurement_condition(measurement_condition)

  participant_metadata = {
    "cohort": "MS",
    "sensor_height_m": sensor_height_m,
    "height_m": height_m,
  }

  recording_metadata = {"measurement_condition": measurement_condition}

  # load the single recording into a valid GaitDataset form.
  loaded_data = {}
  participant_metadata_dataset = {}
  recording_metadata_dataset = {}

  loaded_data[("MS", "1")] = {
    "LowerBack": data
  }
  participant_metadata_dataset[("MS", "1")] = participant_metadata
  recording_metadata_dataset[("MS", "1")] = recording_metadata
  
  dataset = GaitDatasetFromData(
    loaded_data,
    sampling_rate_hz,
    participant_metadata_dataset,
    recording_metadata_dataset,
    index_cols = ["cohort", "id"],
  )

  return dataset

# TODO: once created entities, can pass in as argument rather than individual attributes.
# CSV must have columns: samples, acc_x, acc_y_ acc_z, gyr_x_ gyr_y, gyr_z (according to the explained mobgap coord. system)
def extract_dmos(csv_path: Path, sensor_height_m: float, height_m: float, measurement_condition: str, sampling_rate_hz: int, convertAccFromGToMs: bool = False) -> MobilisedPipelineImpaired:
  # check that measurement condition is one of two types
  is_valid_measurement_condition(measurement_condition)

  # load data, convert to m/s^2 if needed
  data = load_csv(csv_path, convertAccFromGToMs)
  print("data loaded successfully!")

  # create dataset from dataframe
  dataset = create_dataset_from_dataframe(data, sensor_height_m, height_m, measurement_condition, sampling_rate_hz)  
  print ("gait dataset created successfully!")

  # run the single record through the pipeline
  record = dataset[0]
  pipeline = MobilisedPipelineImpaired().run(record)
  print("ran pipeline successfully!")
  
  return pipeline # pipeline object with attributes for gait parameters.

if __name__ == "__main__":
  # print the whole dataframe
  # pd.set_option('display.max_columns', None)
  # pd.set_option('display.max_rows', None)

  # paths = get_all_lab_example_data_paths()
  # example_data_path = paths[("MS", "001")] / "TimeMeasure1_Test11_Trial1.csv"

  # TODO: our provided sample CSV data doesn't work with the pipeline, doesn't detect any initial contacts with the impaired pipeline. Need to make adjustments to the implementation to return these errors and show in the FE.
  # extracted_dmos = extract_dmos(Path("/Users/georgehum/Documents/universitynotes/year 3/dissertation/app/sample_data/MobD CVS_MS data example 2/imu_data.csv"), 1.13, 1.77, "free_living", 100, True)
  # print(extracted_dmos.per_wb_parameters_)

  extracted_dmos = extract_dmos(Path("/Users/georgehum/Documents/universitynotes/year 3/dissertation/app/sample_data/TimeMeasure1_Test11_Trial1 (1).csv"), 0.975, 1.68, "laboratory", 100, True)
  print(extracted_dmos.per_wb_parameters_)

  # print("test")