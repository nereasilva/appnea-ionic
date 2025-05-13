export interface PhysiologicalData {
  _id: string;
  patientId: string;
  timestamp: number;
  dataType: string;
  value: number;
  apnea: boolean;
}
