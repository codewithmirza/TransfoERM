import { AIService } from '../ai/AIService';
import { FormValidationEngine } from './FormValidationEngine';
import type { ValidationResult, FieldValidation } from './types';

interface AIValidationContext {
  fieldHistory: Record<string, any[]>;
  formPatterns: Record<string, any>;
  userBehavior: Record<string, any>;
  domainRules: Record<string, any>;
}

export class AIFormValidationEngine {
  private static instance: AIFormValidationEngine;
  private aiService: AIService;
  private validationEngine: FormValidationEngine;
  private validationContext: AIValidationContext;

  private constructor() {
    this.aiService = AIService.getInstance();
    this.validationEngine = FormValidationEngine.getInstance();
    this.validationContext = {
      fieldHistory: {},
      formPatterns: {},
      userBehavior: {},
      domainRules: {}
    };
  }

  static getInstance(): AIFormValidationEngine {
    if (!AIFormValidationEngine.instance) {
      AIFormValidationEngine.instance = new AIFormValidationEngine();
    }
    return AIFormValidationEngine.instance;
  }

  async validateField(
    formId: string,
    fieldName: string,
    value: any,
    formData: Record<string, any>
  ): Promise<ValidationResult> {
    // First, perform standard validation
    const standardValidation = await this.validationEngine.validateField(
      formId,
      fieldName,
      value,
      formData
    );

    // If standard validation fails, no need for AI validation
    if (!standardValidation.valid) {
      return standardValidation;
    }

    // Perform AI-powered validation
    const aiValidation = await this.performAIValidation(
      formId,
      fieldName,
      value,
      formData
    );

    // Update validation context with new data
    this.updateValidationContext(formId, fieldName, value, aiValidation);

    return {
      valid: aiValidation.valid,
      errors: [...standardValidation.errors, ...aiValidation.errors],
      suggestions: aiValidation.suggestions,
      improvements: aiValidation.improvements
    };
  }

  private async performAIValidation(
    formId: string,
    fieldName: string,
    value: any,
    formData: Record<string, any>
  ): Promise<ValidationResult & { suggestions: string[]; improvements: string[] }> {
    try {
      const analysis = await this.aiService.analyze('Validate form field', {
        fieldName,
        value,
        formData,
        context: this.validationContext,
        formId
      });

      return {
        valid: analysis.isValid,
        errors: analysis.errors || [],
        suggestions: analysis.suggestions || [],
        improvements: analysis.improvements || []
      };
    } catch (error) {
      console.error('AI Validation failed:', error);
      return {
        valid: true,
        errors: [],
        suggestions: [],
        improvements: []
      };
    }
  }

  private updateValidationContext(
    formId: string,
    fieldName: string,
    value: any,
    validationResult: ValidationResult
  ): void {
    // Update field history
    if (!this.validationContext.fieldHistory[fieldName]) {
      this.validationContext.fieldHistory[fieldName] = [];
    }
    this.validationContext.fieldHistory[fieldName].push({
      value,
      timestamp: new Date(),
      validationResult
    });

    // Keep only last 100 entries
    if (this.validationContext.fieldHistory[fieldName].length > 100) {
      this.validationContext.fieldHistory[fieldName].shift();
    }

    // Update form patterns
    this.updateFormPatterns(formId, fieldName, value, validationResult);
  }

  private async updateFormPatterns(
    formId: string,
    fieldName: string,
    value: any,
    validationResult: ValidationResult
  ): Promise<void> {
    try {
      const patterns = await this.aiService.analyze('Analyze form patterns', {
        formId,
        fieldName,
        value,
        validationResult,
        existingPatterns: this.validationContext.formPatterns
      });

      this.validationContext.formPatterns = {
        ...this.validationContext.formPatterns,
        ...patterns
      };
    } catch (error) {
      console.error('Pattern analysis failed:', error);
    }
  }

  async suggestFieldValue(
    formId: string,
    fieldName: string,
    partialValue: string,
    formData: Record<string, any>
  ): Promise<string[]> {
    try {
      const suggestions = await this.aiService.analyze('Suggest field value', {
        formId,
        fieldName,
        partialValue,
        formData,
        context: this.validationContext
      });

      return suggestions.values || [];
    } catch (error) {
      console.error('Value suggestion failed:', error);
      return [];
    }
  }

  async predictFieldValues(
    formId: string,
    formData: Record<string, any>
  ): Promise<Record<string, any>> {
    try {
      const predictions = await this.aiService.predict(formData, {
        formId,
        context: this.validationContext
      });

      return predictions.fieldValues || {};
    } catch (error) {
      console.error('Field prediction failed:', error);
      return {};
    }
  }

  async learnValidationRules(
    formId: string,
    fieldName: string
  ): Promise<FieldValidation> {
    try {
      const learnedRules = await this.aiService.analyze('Learn validation rules', {
        formId,
        fieldName,
        history: this.validationContext.fieldHistory[fieldName],
        patterns: this.validationContext.formPatterns
      });

      return learnedRules.validation;
    } catch (error) {
      console.error('Rule learning failed:', error);
      return { rules: [] };
    }
  }
} 