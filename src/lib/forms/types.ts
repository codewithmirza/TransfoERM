export interface ValidationResult {
  valid: boolean;
  errors: string[];
  suggestions?: string[];
  improvements?: string[];
}

export interface ValidationRule {
  type: 'required' | 'min' | 'max' | 'pattern' | 'custom' | 'ai';
  value?: any;
  message?: string;
  validator?: (value: any) => boolean | Promise<boolean>;
  aiConfig?: {
    model?: string;
    context?: Record<string, any>;
    options?: Record<string, any>;
  };
}

export interface FieldValidation {
  rules: ValidationRule[];
  dependencies?: string[];
  asyncValidators?: Array<(value: any, formData: any) => Promise<boolean>>;
  transformers?: Array<(value: any) => any>;
  aiValidation?: {
    enabled: boolean;
    contextual: boolean;
    learning: boolean;
    suggestions: boolean;
  };
}

export interface FormValidationConfig {
  fields: Record<string, FieldValidation>;
  crossFieldValidation?: Array<{
    fields: string[];
    validator: (values: Record<string, any>) => boolean | Promise<boolean>;
    message: string;
  }>;
  aiOptions?: {
    enabled: boolean;
    learning: boolean;
    suggestions: boolean;
    contextual: boolean;
    models?: {
      validation?: string;
      suggestions?: string;
      learning?: string;
    };
  };
} 