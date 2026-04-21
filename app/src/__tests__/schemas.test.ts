import { expect, test, describe } from 'vitest'
import { SelectFieldsRequestSchema, GenerateJsonRequestSchema } from '../lib/schemas'

describe('Zod Schema Validation', () => {

  test('SelectFieldsRequestSchema validates correct payload', () => {
    const result = SelectFieldsRequestSchema.safeParse({
      prompt: 'A cyberpunk city',
      images: ['data:image/jpeg;base64,data...']
    });
    expect(result.success).toBe(true);
  });

  test('SelectFieldsRequestSchema rejects empty prompt', () => {
    const result = SelectFieldsRequestSchema.safeParse({ prompt: '' });
    expect(result.success).toBe(false);
  });

  test('GenerateJsonRequestSchema validates correctly with aspect ratio', () => {
    const result = GenerateJsonRequestSchema.safeParse({
      prompt: 'A cat',
      required_fields: ['master_prompt', 'subjects'],
      aspect_ratio: '16:9'
    });
    expect(result.success).toBe(true);
  });

});
