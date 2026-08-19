import { create } from "zustand";

type CaptureToInsert = {
  widgetId: string;
  id: string;
  type: string;
  requestId: string;
};

type CaptureStore = {
  captureToInsert: CaptureToInsert | null;
  setCaptureToInsert: (
    capture: CaptureToInsert
  ) => void;
  clearCaptureToInsert: () => void;
};

export const useCaptureStore =
  create<CaptureStore>((set) => ({
    captureToInsert: null,

    setCaptureToInsert: (capture) =>
      set({
        captureToInsert: capture,
      }),

    clearCaptureToInsert: () =>
      set({
        captureToInsert: null,
      }),
  }));