import { Client } from '@gradio/client';

// Singleton instance — created once and reused for every request
let hfClientInstance: Awaited<ReturnType<typeof Client.connect>> | null = null;

/**
 * Returns a lazily-initialised Gradio client connected to the
 * Hugging Face Space hosting the monkeypox classification model.
 */
export const getModelClient = async () => {
  if (!hfClientInstance) {
    console.log('🔌 Connecting to Hugging Face Model...');
    hfClientInstance = await Client.connect('m-taha6/monkeypox-Backup');
    console.log('✅ Connected Successfully to Hugging Face!');
  }
  return hfClientInstance;
};

export interface PredictionResult {
  label: string;
  score: number;
}

/**
 * Run the skin-disease classifier on an image blob.
 * Returns the predicted label (e.g. "Monkeypox", "Normal").
 */
export const classifyImage = async (blob: Blob): Promise<string> => {
  const client = await getModelClient();

  const result = await client.predict('/predict', { image: blob });

  let predicted = 'Normal';
  const data = result?.data as unknown[] | undefined;
  if (data?.[0]) {
    const first = data[0] as PredictionResult | string;
    predicted = typeof first === 'string' ? first : (first.label ?? 'Normal');
  }

  return predicted;
};
