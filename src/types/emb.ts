export type EmbSupportStatus = "unsupported" | "invalid";

export interface EmbFileSummary {
  name: string;
  sizeBytes: number;
  extension: string;
  headerHex: string;
  status: EmbSupportStatus;
  message: string;
}
