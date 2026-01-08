/**
 * 🎙️ MedPact Voice-First Analytics Engine
 * Revolutionary voice command processing for financial market intelligence
 * 
 * Features:
 * • Natural language voice queries for market data
 * • SEC filing analysis via voice commands  
 * • Cross-domain correlation through speech
 * • AI-powered intent recognition
 * • Real-time confidence scoring
 */

interface VoiceCommand {
  intent: 'market_query' | 'sec_analysis' | 'payer_correlation' | 'predictive_scenario' | 'avatar_interaction'
  confidence: number
  entities: Record<string, any>
  rawText: string
  audioData?: string
}

interface VoiceResponse {
  success: boolean
  data?: any
  narration: string
  charts?: any[]
  followUpSuggestions: string[]
}

class VoiceFinancialAnalyticsEngine {
  private isListening = false
  private recognition: any | null = null
  private apiBaseUrl = process.env.NEXT_PUBLIC_MEDPACT_API_URL || 'https://api.medpact.com'

  constructor() {
    this.initializeSpeechRecognition()
  }

  private initializeSpeechRecognition() {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      this.recognition = new (window as any).webkitSpeechRecognition()
      this.recognition.continuous = false
      this.recognition.interimResults = false
      this.recognition.lang = 'en-US'
    } else if (typeof window !== 'undefined' && 'SpeechRecognition' in window) {
      this.recognition = new (window as any).SpeechRecognition()
      this.recognition.continuous = false
      this.recognition.interimResults = false
      this.recognition.lang = 'en-US'
    }
  }

  /**
   * 🎙️ Start listening for voice commands
   */
  async startListening(callback: (command: VoiceCommand) => void): Promise<void> {
    if (!this.recognition) {
      throw new Error('Speech recognition not supported in this browser')
    }

    return new Promise((resolve, reject) => {
      if (!this.recognition) return reject(new Error('Speech recognition not available'))

      this.isListening = true
      
      this.recognition.onresult = async (event: any) => {
        const transcript = event.results[event.results.length - 1][0].transcript
        if (event.results[event.results.length - 1].isFinal) {
          this.stopListening()
          // Process the voice command
          const command = await this.parseVoiceCommand(transcript, 0.9)
          callback(command)
        }
      }

      this.recognition.onerror = (event: any) => {
        this.isListening = false
        reject(new Error(`Speech recognition error: ${event.error}`))
      }

      this.recognition.onend = () => {
        this.isListening = false
      }

      this.recognition.start()
    })
  }

  /**
   * 🧠 Parse voice command using NLP and intent recognition
   */
  private async parseVoiceCommand(transcript: string, confidence: number): Promise<VoiceCommand> {
    // Market query patterns
    const marketPatterns = [
      /(?:what|show|get).*(?:top|best|worst).*(?:\d+).*(?:movers?|stocks?|performers?).*(?:in|for).*(?:biotech|pharma|healthcare)/i,
      /(?:analyze|check|look at).*(?:market|stock|equity).*(?:data|performance|trends)/i,
      /(?:cross-reference|correlate|compare).*(?:with|against).*(?:payer|insurance|transparency)/i
    ]

    // SEC filing patterns  
    const secPatterns = [
      /(?:run|execute|perform).*(?:10-k|10-q|8-k|sec|filing).*(?:analysis|review)/i,
      /(?:analyze|check|examine).*(?:filings?|documents?).*(?:for|from).*([A-Z]{2,5})/i,
      /(?:edgar|sec).*(?:search|lookup|analysis)/i
    ]

    // Payer correlation patterns
    const payerPatterns = [
      /(?:payer|insurance|reimbursement).*(?:transparency|rates?|changes?)/i,
      /(?:cms|medicaid|medicare).*(?:data|updates?|changes?)/i,
      /(?:coverage|formulary|prior auth)/i
    ]

    // Predictive scenario patterns
    const predictivePatterns = [
      /(?:predict|forecast|model|scenario).*(?:if|what if|impact)/i,
      /(?:revenue|earnings?).*(?:impact|effect|projection)/i,
      /(?:policy|regulation).*(?:change|update).*(?:affect|impact)/i
    ]

    // Avatar interaction patterns
    const avatarPatterns = [
      /(?:explain|tell me|describe).*(?:in plain|simple|easy).*(?:language|terms)/i,
      /(?:avatar|ai|assistant).*(?:brief|summary|explanation)/i
    ]

    let intent: VoiceCommand['intent'] = 'market_query'
    let entities: Record<string, any> = {}

    // Intent classification
    if (marketPatterns.some(pattern => pattern.test(transcript))) {
      intent = 'market_query'
      
      // Extract entities for market queries
      const numberMatch = transcript.match(/(?:top|best|worst)\s+(\d+)/i)
      const sectorMatch = transcript.match(/(?:in|for)\s+(biotech|pharma|healthcare|oncology|cardiology|immunology)/i)
      const timeMatch = transcript.match(/(today|yesterday|this week|last week|month|quarter)/i)
      
      entities = {
        count: numberMatch ? parseInt(numberMatch[1]) : 10,
        sector: sectorMatch ? sectorMatch[1].toLowerCase() : 'healthcare',
        timeframe: timeMatch ? timeMatch[1].toLowerCase() : 'today',
        includePayerData: /payer|transparency|reimbursement/i.test(transcript),
        includeClinicalData: /clinical|outcomes|trials/i.test(transcript)
      }
    } 
    else if (secPatterns.some(pattern => pattern.test(transcript))) {
      intent = 'sec_analysis'
      
      const tickerMatch = transcript.match(/(?:for|from)\s+([A-Z]{2,5})/i)
      const filingTypeMatch = transcript.match(/(10-k|10-q|8-k)/i)
      
      entities = {
        ticker: tickerMatch ? tickerMatch[1].toUpperCase() : null,
        filingTypes: filingTypeMatch ? [filingTypeMatch[1].toUpperCase()] : ['10-K', '10-Q', '8-K'],
        includePayerCorrelation: /payer|transparency|reimbursement/i.test(transcript),
        therapeuticArea: this.extractTherapeuticArea(transcript)
      }
    }
    else if (payerPatterns.some(pattern => pattern.test(transcript))) {
      intent = 'payer_correlation'
      
      entities = {
        payerType: this.extractPayerType(transcript),
        therapeuticArea: this.extractTherapeuticArea(transcript),
        changeType: this.extractChangeType(transcript)
      }
    }
    else if (predictivePatterns.some(pattern => pattern.test(transcript))) {
      intent = 'predictive_scenario'
      
      entities = {
        scenarioType: this.extractScenarioType(transcript),
        timeHorizon: this.extractTimeHorizon(transcript),
        impactArea: this.extractImpactArea(transcript)
      }
    }
    else if (avatarPatterns.some(pattern => pattern.test(transcript))) {
      intent = 'avatar_interaction'
      
      entities = {
        explanationLevel: /simple|easy|plain/i.test(transcript) ? 'novice' : 'intermediate',
        topic: this.extractAvatarTopic(transcript)
      }
    }

    return {
      intent,
      confidence: Math.min(confidence * 1.2, 1.0), // Boost confidence slightly for financial terms
      entities,
      rawText: transcript
    }
  }

  /**
   * 🚀 Execute voice command and return structured response
   */
  async executeVoiceCommand(command: VoiceCommand): Promise<VoiceResponse> {
    try {
      switch (command.intent) {
        case 'market_query':
          return await this.executeMarketQuery(command)
        
        case 'sec_analysis':
          return await this.executeSECAnalysis(command)
        
        case 'payer_correlation':
          return await this.executePayerCorrelation(command)
        
        case 'predictive_scenario':
          return await this.executePredictiveScenario(command)
        
        case 'avatar_interaction':
          return await this.executeAvatarInteraction(command)
        
        default:
          throw new Error(`Unsupported intent: ${command.intent}`)
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      return {
        success: false,
        narration: `I encountered an error processing your request: ${errorMessage}`,
        followUpSuggestions: [
          "Try rephrasing your question",
          "Ask about specific stock tickers",
          "Request market data for a specific sector"
        ]
      }
    }
  }

  /**
   * 📈 Execute market query command
   */
  private async executeMarketQuery(command: VoiceCommand): Promise<VoiceResponse> {
    const response = await fetch(`${this.apiBaseUrl}/api/financialanalytics/voice-market-query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify({
        userId: this.getCurrentUserId(),
        query: command.rawText,
        audioBase64: command.audioData,
        userType: 'analyst'
      })
    })

    if (!response.ok) {
      throw new Error(`Market query failed: ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      data: data,
      narration: this.generateMarketNarration(data, command.entities),
      charts: data.charts || [],
      followUpSuggestions: [
        "Show me the SEC filings for these companies",
        "What are the payer impacts for these stocks?",
        "Run a predictive scenario analysis"
      ]
    }
  }

  /**
   * 📊 Execute SEC analysis command
   */
  private async executeSECAnalysis(command: VoiceCommand): Promise<VoiceResponse> {
    if (!command.entities.ticker) {
      throw new Error("Please specify a company ticker symbol")
    }

    const response = await fetch(`${this.apiBaseUrl}/api/financialanalytics/sec-edgar/company-analysis/${command.entities.ticker}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${this.getAuthToken()}`
      }
    })

    if (!response.ok) {
      throw new Error(`SEC analysis failed: ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      data: data,
      narration: this.generateSECNarration(data, command.entities),
      followUpSuggestions: [
        "Cross-reference with payer transparency data",
        "Show market impact of these filings",
        "Explain this in simple terms"
      ]
    }
  }

  /**
   * 🏥 Execute payer correlation command
   */
  private async executePayerCorrelation(command: VoiceCommand): Promise<VoiceResponse> {
    // Mock implementation - would call actual payer transparency API
    const mockData = {
      payerChanges: [
        { payer: 'Anthem', change: 'Rate decrease', therapy: command.entities.therapeuticArea || 'Oncology', impact: -2.3 },
        { payer: 'Aetna', change: 'Coverage expansion', therapy: command.entities.therapeuticArea || 'Immunology', impact: 4.7 }
      ],
      marketCorrelation: 0.73
    }
    
    return {
      success: true,
      data: mockData,
      narration: `I found ${mockData.payerChanges.length} recent payer changes affecting ${command.entities.therapeuticArea || 'healthcare'} with a ${mockData.marketCorrelation * 100}% correlation to market movements.`,
      followUpSuggestions: [
        "Show me the affected stock prices",
        "Predict the revenue impact",
        "Get more details on specific payers"
      ]
    }
  }

  /**
   * 🔮 Execute predictive scenario command
   */
  private async executePredictiveScenario(command: VoiceCommand): Promise<VoiceResponse> {
    const response = await fetch(`${this.apiBaseUrl}/api/financialanalytics/predictive/scenario-analysis`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify({
        scenarioName: `Voice Query: ${command.rawText}`,
        scenarioType: command.entities.scenarioType || 'policy_change',
        includeMarketData: true,
        includePayerData: true,
        includeClinicalData: true,
        predictionTimeframe: command.entities.timeHorizon || 'PT90D',
        scenarioParameters: command.entities,
        requiredConfidence: 0.80
      })
    })

    if (!response.ok) {
      throw new Error(`Predictive analysis failed: ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      data: data,
      narration: `Based on my predictive modeling with ${Math.round(data.predictionConfidence * 100)}% confidence, ${this.generatePredictiveNarration(data)}`,
      charts: data.timelineProjections || [],
      followUpSuggestions: [
        "Show me the risk factors",
        "What are the recommended actions?",
        "Run a different scenario"
      ]
    }
  }

  /**
   * 🤖 Execute AI avatar interaction
   */
  private async executeAvatarInteraction(command: VoiceCommand): Promise<VoiceResponse> {
    const response = await fetch(`${this.apiBaseUrl}/api/financialanalytics/ai-avatar/financial-qa`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.getAuthToken()}`
      },
      body: JSON.stringify({
        question: command.rawText,
        userType: 'analyst',
        relevantData: command.entities,
        conversationHistory: []
      })
    })

    if (!response.ok) {
      throw new Error(`Avatar interaction failed: ${response.statusText}`)
    }

    const data = await response.json()
    
    return {
      success: true,
      data: data,
      narration: data.avatarResponse,
      followUpSuggestions: data.followUpTopics || [
        "Ask another question",
        "Get more details",
        "Switch to a different avatar"
      ]
    }
  }

  // Helper methods for entity extraction
  private extractTherapeuticArea(text: string): string {
    const areas = ['oncology', 'cardiology', 'immunology', 'neurology', 'respiratory', 'diabetes']
    const match = areas.find(area => text.toLowerCase().includes(area))
    return match || 'general'
  }

  private extractPayerType(text: string): string {
    if (/anthem|aetna|humana|unitedhealth/i.test(text)) return 'commercial'
    if (/medicare|medicaid|cms/i.test(text)) return 'government'
    return 'all'
  }

  private extractChangeType(text: string): string {
    if (/rate|price|cost/i.test(text)) return 'pricing'
    if (/coverage|formulary/i.test(text)) return 'coverage'
    if (/prior auth|authorization/i.test(text)) return 'authorization'
    return 'general'
  }

  private extractScenarioType(text: string): string {
    if (/policy|regulation/i.test(text)) return 'policy_change'
    if (/market|economic/i.test(text)) return 'market_shock'
    if (/clinical|trial/i.test(text)) return 'clinical_breakthrough'
    return 'general'
  }

  private extractTimeHorizon(text: string): string {
    if (/next quarter|q4|3 month/i.test(text)) return 'PT90D'
    if (/next year|annual/i.test(text)) return 'P1Y'
    if (/next month|30 day/i.test(text)) return 'PT30D'
    return 'PT90D'
  }

  private extractImpactArea(text: string): string {
    if (/revenue|earnings|financial/i.test(text)) return 'financial'
    if (/patient|clinical|outcome/i.test(text)) return 'clinical'
    if (/market|competitive/i.test(text)) return 'market'
    return 'financial'
  }

  private extractAvatarTopic(text: string): string {
    if (/market|stock|financial/i.test(text)) return 'market_analysis'
    if (/sec|filing|regulatory/i.test(text)) return 'regulatory'
    if (/payer|insurance|reimbursement/i.test(text)) return 'payer_dynamics'
    return 'general'
  }

  // Narration generation methods
  private generateMarketNarration(data: any, entities: any): string {
    const { count = 10, sector = 'healthcare', timeframe = 'today' } = entities
    return `I found ${count} top market movers in ${sector} for ${timeframe}. ${data.marketMovers?.length || 0} stocks show significant movement with ${data.payerCorrelations?.length || 0} payer correlations identified.`
  }

  private generateSECNarration(data: any, entities: any): string {
    const { ticker } = entities
    return `Analysis of ${ticker} SEC filings reveals ${data.keyRiskFactors?.length || 0} risk factors with ${data.healthcareCorrelations ? 'significant' : 'limited'} healthcare correlations.`
  }

  private generatePredictiveNarration(data: any): string {
    const impactDirection = data.financialImpacts?.overallImpact > 0 ? 'positive' : 'negative'
    const magnitude = Math.abs(data.financialImpacts?.overallImpact || 0)
    return `the scenario would have a ${impactDirection} impact of approximately ${magnitude}% on the affected metrics.`
  }

  // Utility methods
  private getAuthToken(): string {
    // In a real app, this would get the JWT token from secure storage
    return localStorage.getItem('medpact_auth_token') || 'demo_token'
  }

  private getCurrentUserId(): string {
    return localStorage.getItem('medpact_user_id') || 'demo_user'
  }

  /**
   * Stop listening for voice commands
   */
  stopListening(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop()
      this.isListening = false
    }
  }

  /**
   * Check if currently listening
   */
  getIsListening(): boolean {
    return this.isListening
  }
}

// Export singleton instance
export const voiceEngine = new VoiceFinancialAnalyticsEngine()
export default voiceEngine
