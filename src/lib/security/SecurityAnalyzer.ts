import { ErrorHandler, ErrorSeverity } from '../error/ErrorHandler'
import { Logger, LogLevel } from '../logging/Logger'

interface SecurityVulnerability {
  id: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  description: string
  location?: string
  recommendation: string
  cwe?: string // Common Weakness Enumeration ID
}

interface SecurityAnalysisResult {
  vulnerabilities: SecurityVulnerability[]
  score: number // 0-100
  recommendations: string[]
  complianceStatus: Record<string, boolean>
}

export class SecurityAnalyzer {
  private static instance: SecurityAnalyzer
  private errorHandler: ErrorHandler
  private logger: Logger

  private constructor() {
    this.errorHandler = ErrorHandler.getInstance()
    this.logger = Logger.getInstance()
  }

  static getInstance(): SecurityAnalyzer {
    if (!SecurityAnalyzer.instance) {
      SecurityAnalyzer.instance = new SecurityAnalyzer()
    }
    return SecurityAnalyzer.instance
  }

  async analyzeCode(code: string): Promise<SecurityAnalysisResult> {
    try {
      const vulnerabilities = await this.detectVulnerabilities(code)
      const score = this.calculateSecurityScore(vulnerabilities)
      const recommendations = this.generateRecommendations(vulnerabilities)
      const complianceStatus = await this.checkCompliance(code)

      await this.logger.log(LogLevel.INFO, 'Security analysis completed', {
        score,
        vulnerabilityCount: vulnerabilities.length
      })

      return {
        vulnerabilities,
        score,
        recommendations,
        complianceStatus
      }
    } catch (error) {
      await this.errorHandler.handleError(
        error as Error,
        ErrorSeverity.HIGH,
        { context: 'SecurityAnalyzer.analyzeCode' }
      )
      throw error
    }
  }

  private async detectVulnerabilities(code: string): Promise<SecurityVulnerability[]> {
    const vulnerabilities: SecurityVulnerability[] = []

    // Check for common security issues
    await Promise.all([
      this.checkForInjectionVulnerabilities(code, vulnerabilities),
      this.checkForAuthenticationIssues(code, vulnerabilities),
      this.checkForDataExposure(code, vulnerabilities),
      this.checkForInsecureConfigurations(code, vulnerabilities)
    ])

    return vulnerabilities
  }

  private async checkForInjectionVulnerabilities(
    code: string,
    vulnerabilities: SecurityVulnerability[]
  ): Promise<void> {
    const patterns = [
      { regex: /eval\s*\(/, cwe: '94', description: 'Code Injection' },
      { regex: /exec\s*\(/, cwe: '78', description: 'OS Command Injection' },
      { regex: /innerHTML\s*=/, cwe: '79', description: 'XSS Vulnerability' }
    ]

    patterns.forEach(pattern => {
      if (pattern.regex.test(code)) {
        vulnerabilities.push({
          id: crypto.randomUUID(),
          severity: 'high',
          description: `Potential ${pattern.description} detected`,
          cwe: pattern.cwe,
          recommendation: `Avoid using ${pattern.description}. Use safe alternatives.`
        })
      }
    })
  }

  private async checkForAuthenticationIssues(
    code: string,
    vulnerabilities: SecurityVulnerability[]
  ): Promise<void> {
    const patterns = [
      { regex: /password|secret|key/i, description: 'Hardcoded Secrets' },
      { regex: /auth.*bypass/i, description: 'Authentication Bypass' }
    ]

    patterns.forEach(pattern => {
      if (pattern.regex.test(code)) {
        vulnerabilities.push({
          id: crypto.randomUUID(),
          severity: 'critical',
          description: `Potential ${pattern.description} detected`,
          recommendation: `Remove ${pattern.description.toLowerCase()} and use secure configuration management.`
        })
      }
    })
  }

  private async checkForDataExposure(
    code: string,
    vulnerabilities: SecurityVulnerability[]
  ): Promise<void> {
    const patterns = [
      { regex: /console\.log/, description: 'Sensitive Data Exposure' },
      { regex: /debugger/, description: 'Debugging Code' }
    ]

    patterns.forEach(pattern => {
      if (pattern.regex.test(code)) {
        vulnerabilities.push({
          id: crypto.randomUUID(),
          severity: 'medium',
          description: `Potential ${pattern.description} detected`,
          recommendation: `Remove ${pattern.description.toLowerCase()} before deployment.`
        })
      }
    })
  }

  private async checkForInsecureConfigurations(
    code: string,
    vulnerabilities: SecurityVulnerability[]
  ): Promise<void> {
    const patterns = [
      { regex: /noValidate/, description: 'Input Validation Disabled' },
      { regex: /allowAllOrigins/, description: 'Insecure CORS Configuration' }
    ]

    patterns.forEach(pattern => {
      if (pattern.regex.test(code)) {
        vulnerabilities.push({
          id: crypto.randomUUID(),
          severity: 'high',
          description: `${pattern.description} detected`,
          recommendation: `Enable proper validation and restrict CORS policies.`
        })
      }
    })
  }

  private calculateSecurityScore(vulnerabilities: SecurityVulnerability[]): number {
    const weights = {
      critical: 1.0,
      high: 0.7,
      medium: 0.4,
      low: 0.1
    }

    const weightedSum = vulnerabilities.reduce((sum, vuln) => {
      return sum + weights[vuln.severity]
    }, 0)

    return Math.max(0, 100 - (weightedSum * 10))
  }

  private generateRecommendations(vulnerabilities: SecurityVulnerability[]): string[] {
    const recommendations = new Set<string>()
    
    vulnerabilities.forEach(vuln => {
      recommendations.add(vuln.recommendation)
    })

    return Array.from(recommendations)
  }

  private async checkCompliance(code: string): Promise<Record<string, boolean>> {
    return {
      'GDPR': await this.checkGDPRCompliance(code),
      'HIPAA': await this.checkHIPAACompliance(code),
      'PCI-DSS': await this.checkPCIDSSCompliance(code),
      'SOX': await this.checkSOXCompliance(code)
    }
  }

  private async checkGDPRCompliance(code: string): Promise<boolean> {
    const gdprPatterns = [
      { regex: /personal_data|pii/i, description: 'Personal Data Processing' },
      { regex: /consent|opt[_-]?in/i, description: 'Consent Management' },
      { regex: /data[_-]?retention/i, description: 'Data Retention' },
      { regex: /right[_-]?to[_-]?forget/i, description: 'Right to be Forgotten' }
    ]

    let isCompliant = true
    for (const pattern of gdprPatterns) {
      if (pattern.regex.test(code)) {
        await this.logger.log(LogLevel.WARN, `GDPR compliance check: ${pattern.description} detected`)
        isCompliant = false
      }
    }
    return isCompliant
  }

  private async checkHIPAACompliance(code: string): Promise<boolean> {
    const hipaaPatterns = [
      { regex: /health[_-]?data|medical[_-]?record/i, description: 'Health Information' },
      { regex: /phi|protected[_-]?health/i, description: 'Protected Health Information' },
      { regex: /encryption|decrypt/i, description: 'Data Encryption' }
    ]

    let isCompliant = true
    for (const pattern of hipaaPatterns) {
      if (pattern.regex.test(code)) {
        await this.logger.log(LogLevel.WARN, `HIPAA compliance check: ${pattern.description} detected`)
        isCompliant = false
      }
    }
    return isCompliant
  }

  private async checkPCIDSSCompliance(code: string): Promise<boolean> {
    const pciPatterns = [
      { regex: /credit[_-]?card|card[_-]?number/i, description: 'Credit Card Data' },
      { regex: /cvv|security[_-]?code/i, description: 'Card Security Codes' },
      { regex: /pan|primary[_-]?account[_-]?number/i, description: 'Payment Card Data' }
    ]

    let isCompliant = true
    for (const pattern of pciPatterns) {
      if (pattern.regex.test(code)) {
        await this.logger.log(LogLevel.WARN, `PCI-DSS compliance check: ${pattern.description} detected`)
        isCompliant = false
      }
    }
    return isCompliant
  }

  private async checkSOXCompliance(code: string): Promise<boolean> {
    const soxPatterns = [
      { regex: /financial[_-]?data|accounting/i, description: 'Financial Data' },
      { regex: /audit[_-]?log|audit[_-]?trail/i, description: 'Audit Trail' },
      { regex: /internal[_-]?control/i, description: 'Internal Controls' }
    ]

    let isCompliant = true
    for (const pattern of soxPatterns) {
      if (pattern.regex.test(code)) {
        await this.logger.log(LogLevel.WARN, `SOX compliance check: ${pattern.description} detected`)
        isCompliant = false
      }
    }
    return isCompliant
  }
} 