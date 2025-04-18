import { perStrideDataFields, perWbDataFields } from "@/lib/fields";

export type Record = { [key: string]: number };

export type InputsForm = {
  name: string;
  description: string;
  patientHeight: number;
  sensorHeight: number;
  samplingRate: number;
  setting: "laboratory" | "free_living";
  csvFile: File;
  convertToMs: boolean;
  public: boolean;
};

export type InputsJson = Omit<InputsForm, "csvFile"> & { csvFile: string };

export type AggregateParameter = {
  param: string;
  max: number;
  min: number;
  avg: number;
  var: number;
};

export type AggregateParameters = Array<AggregateParameter>;

export type PerWbParameter = {
  wb_id: number;
  start: number;
  end: number;
  n_strides: number;
  duration_s: number;
  stride_duration_s: number;
  stride_length_m: number;
  walking_speed_mps: number;
  cadence_spm: number;
};

export type PerWbDataField = (typeof perWbDataFields)[number];

export type PerWbParameters = Array<PerWbParameter>;

export type PerStrideParameter = {
  wb_id: number;
  s_id: number;
  start: number;
  end: number;
  lr_label: string;
  cadence_spm: number;
  stride_duration_s: number;
  stride_length_m: number;
  walking_speed_mps: number;
};

export type PerStrideDataField = (typeof perStrideDataFields)[number];

export type PerStrideParameters = Array<PerStrideParameter>;
