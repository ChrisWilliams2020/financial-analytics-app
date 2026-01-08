export class AnalyticsEngine {
  private contracts: any[] = [];
  private payments: any[] = [];
  private claims: any[] = [];
  private searchIndex: Map<string, any[]> = new Map();
  private users: any[] = [];
  private roles: any[] = [];
  private organizations: any[] = [];

  constructor() {
    this.initializeSearchIndex();
  }

  private initializeSearchIndex() {
    this.searchIndex.set('payers', []);
    this.searchIndex.set('cptCodes', []);
    this.searchIndex.set('claims', []);
    this.searchIndex.set('contracts', []);
  }

  loadData(data: {
    contracts: any[];
    payments: any[];
    claims: any[];
    users: any[];
    roles: any[];
    organizations: any[];
  }) {
    this.contracts = data.contracts;
    this.payments = data.payments;
    this.claims = data.claims;
    this.users = data.users;
    this.roles = data.roles;
    this.organizations = data.organizations;
    this.buildSearchIndexes();
  }

  private buildSearchIndexes() {
    const payerIndex = new Map<string, any>();
    this.contracts.forEach(contract => {
      if (!payerIndex.has(contract.payerId)) {
        payerIndex.set(contract.payerId, {
          payerId: contract.payerId,
          payerName: contract.payerName,
          contracts: [],
          totalContracts: 0,
          avgRate: 0
        });
      }
      const payer = payerIndex.get(contract.payerId);
      payer.contracts.push(contract);
      payer.totalContracts++;
    });

    this.searchIndex.set('payers', Array.from(payerIndex.values()));

    const cptIndex = new Map<string, any>();
    this.contracts.forEach(contract => {
      if (!cptIndex.has(contract.cptCode)) {
        cptIndex.set(contract.cptCode, {
          cptCode: contract.cptCode,
          payers: [],
          avgRate: 0,
          minRate: Infinity,
          maxRate: 0
        });
      }
      const cpt = cptIndex.get(contract.cptCode);
      cpt.payers.push({
        payerId: contract.payerId,
        payerName: contract.payerName,
        rate: contract.contractRate
      });
      cpt.minRate = Math.min(cpt.minRate, contract.contractRate);
      cpt.maxRate = Math.max(cpt.maxRate, contract.contractRate);
    });

    this.searchIndex.set('cptCodes', Array.from(cptIndex.values()));
  }

  search(query: string, type: 'PAYER' | 'CPT' | 'CLAIM' | 'ALL'): any[] {
    const searchTerm = query.toLowerCase();

    switch (type) {
      case 'PAYER':
        return this.searchPayers(searchTerm);
      case 'CPT':
        return this.searchCPTCodes(searchTerm);
      case 'CLAIM':
        return this.searchClaims(searchTerm);
      case 'ALL':
        return [
          ...this.searchPayers(searchTerm),
          ...this.searchCPTCodes(searchTerm),
          ...this.searchClaims(searchTerm)
        ];
      default:
        return [];
    }
  }

  private searchPayers(query: string): any[] {
    const payers = this.searchIndex.get('payers') || [];
    return payers.filter(payer => 
      payer.payerId.toLowerCase().includes(query) ||
      payer.payerName.toLowerCase().includes(query)
    );
  }

  private searchCPTCodes(query: string): any[] {
    const cpts = this.searchIndex.get('cptCodes') || [];
    return cpts.filter(cpt => 
      cpt.cptCode.toLowerCase().includes(query)
    );
  }

  private searchClaims(query: string): any[] {
    return this.claims.filter(claim =>
      claim.claimId.toLowerCase().includes(query) ||
      claim.payerName.toLowerCase().includes(query) ||
      claim.cptCode.toLowerCase().includes(query)
    );
  }

  verifyPayments(): {
    totalPayments: number;
    matchingPayments: number;
    underpayments: number;
    totalVariance: number;
    accuracyRate: number;
    details: any[];
    mlPredictions: any[];
  } {
    const verificationResults: any[] = [];
    const mlPredictions: any[] = [];
    let totalVariance = 0;
    let matchingCount = 0;

    this.payments.forEach(payment => {
      const contract = this.contracts.find(c => 
        c.payerId === payment.payerId && 
        c.cptCode === payment.cptCode
      );

      if (contract) {
        const variance = payment.amountPaid - contract.contractRate;
        const variancePercent = (variance / contract.contractRate) * 100;
        const isMatch = Math.abs(variancePercent) < 2;

        if (isMatch) matchingCount++;
        totalVariance += variance;

        verificationResults.push({
          claimId: payment.claimId,
          payerName: payment.payerName,
          cptCode: payment.cptCode,
          contractRate: contract.contractRate,
          amountPaid: payment.amountPaid,
          variance: variance,
          variancePercent: variancePercent.toFixed(2) + '%',
          status: isMatch ? 'MATCH' : 'UNDERPAID',
          payerId: payment.payerId,
          dateOfService: payment.dateOfService
        });

        if (!isMatch) {
          mlPredictions.push({
            claimId: payment.claimId,
            predictedUnderpayment: Math.abs(variance),
            actualUnderpayment: variance,
            riskScore: Math.min(100, Math.abs(variancePercent) * 2),
            confidence: 0.85,
            recommendedAction: Math.abs(variancePercent) > 10 ? 'Immediate Appeal' : 'Review'
          });
        }
      }
    });

    return {
      totalPayments: this.payments.length,
      matchingPayments: matchingCount,
      underpayments: this.payments.length - matchingCount,
      totalVariance: totalVariance,
      accuracyRate: this.payments.length > 0 ? (matchingCount / this.payments.length) * 100 : 0,
      details: verificationResults,
      mlPredictions: mlPredictions
    };
  }

  getRevenueAnalytics(): {
    totalBilled: number;
    totalPaid: number;
    collectionRate: number;
    outstandingAmount: number;
    payerBreakdown: any[];
    cptBreakdown: any[];
    predictedRevenue: number;
  } {
    const totalBilled = this.claims.reduce((sum, c) => sum + (c.amountBilled || 0), 0);
    const totalPaid = this.payments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);

    const payerMap = new Map<string, { billed: number; paid: number }>();
    this.payments.forEach(payment => {
      if (!payerMap.has(payment.payerId)) {
        payerMap.set(payment.payerId, { billed: 0, paid: 0 });
      }
      const payer = payerMap.get(payment.payerId)!;
      payer.paid += payment.amountPaid || 0;
      payer.billed += payment.amountBilled || 0;
    });

    const payerBreakdown = Array.from(payerMap.entries()).map(([payerId, data]) => ({
      payerId,
      payerName: this.payments.find(p => p.payerId === payerId)?.payerName || '',
      totalBilled: data.billed,
      totalPaid: data.paid,
      collectionRate: data.billed > 0 ? (data.paid / data.billed) * 100 : 0
    }));

    const cptMap = new Map<string, { billed: number; paid: number; count: number }>();
    this.claims.forEach(claim => {
      if (!cptMap.has(claim.cptCode)) {
        cptMap.set(claim.cptCode, { billed: 0, paid: 0, count: 0 });
      }
      const cpt = cptMap.get(claim.cptCode)!;
      cpt.billed += claim.amountBilled || 0;
      cpt.count++;
    });

    this.payments.forEach(payment => {
      if (cptMap.has(payment.cptCode)) {
        cptMap.get(payment.cptCode)!.paid += payment.amountPaid || 0;
      }
    });

    const cptBreakdown = Array.from(cptMap.entries()).map(([cptCode, data]) => ({
      cptCode,
      totalBilled: data.billed,
      totalPaid: data.paid,
      count: data.count,
      avgBilled: data.count > 0 ? data.billed / data.count : 0,
      avgPaid: data.count > 0 ? data.paid / data.count : 0
    }));

    return {
      totalBilled,
      totalPaid,
      collectionRate: totalBilled > 0 ? (totalPaid / totalBilled) * 100 : 0,
      outstandingAmount: totalBilled - totalPaid,
      payerBreakdown,
      cptBreakdown,
      predictedRevenue: totalPaid * 1.15
    };
  }

  getContractCompliance(): {
    totalContracts: number;
    activeContracts: number;
    expiringContracts: number;
    payerCompliance: any[];
  } {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    const activeContracts = this.contracts.filter(c => {
      const expDate = new Date(c.expirationDate);
      return expDate > now;
    });

    const expiringContracts = this.contracts.filter(c => {
      const expDate = new Date(c.expirationDate);
      return expDate > now && expDate < thirtyDaysFromNow;
    });

    const payerComplianceMap = new Map<string, {
      totalClaims: number;
      compliantPayments: number;
      totalVariance: number;
    }>();

    const verification = this.verifyPayments();
    verification.details.forEach(detail => {
      if (!payerComplianceMap.has(detail.payerName)) {
        payerComplianceMap.set(detail.payerName, {
          totalClaims: 0,
          compliantPayments: 0,
          totalVariance: 0
        });
      }
      const payer = payerComplianceMap.get(detail.payerName)!;
      payer.totalClaims++;
      if (detail.status === 'MATCH') payer.compliantPayments++;
      payer.totalVariance += detail.variance;
    });

    const payerCompliance = Array.from(payerComplianceMap.entries()).map(([payerName, data]) => ({
      payerName,
      totalClaims: data.totalClaims,
      compliantPayments: data.compliantPayments,
      complianceRate: data.totalClaims > 0 ? (data.compliantPayments / data.totalClaims) * 100 : 0,
      totalVariance: data.totalVariance
    }));

    return {
      totalContracts: this.contracts.length,
      activeContracts: activeContracts.length,
      expiringContracts: expiringContracts.length,
      payerCompliance
    };
  }

  detectUnderpaymentPatterns(): {
    suspiciousPayments: any[];
    payerRiskScores: Map<string, number>;
    recommendations: string[];
  } {
    const suspiciousPayments: any[] = [];
    const payerRiskMap = new Map<string, { total: number; underpaid: number }>();

    this.payments.forEach(payment => {
      const contract = this.contracts.find(c => 
        c.payerId === payment.payerId && 
        c.cptCode === payment.cptCode
      );

      if (contract) {
        const variance = payment.amountPaid - contract.contractRate;
        const variancePercent = (variance / contract.contractRate) * 100;

        if (!payerRiskMap.has(payment.payerId)) {
          payerRiskMap.set(payment.payerId, { total: 0, underpaid: 0 });
        }
        const payerRisk = payerRiskMap.get(payment.payerId)!;
        payerRisk.total++;
        if (variancePercent < -2) payerRisk.underpaid++;

        if (variancePercent < -5) {
          suspiciousPayments.push({
            claimId: payment.claimId,
            payerName: payment.payerName,
            cptCode: payment.cptCode,
            expectedAmount: contract.contractRate,
            actualAmount: payment.amountPaid,
            variance: variance,
            variancePercent: variancePercent,
            riskLevel: this.calculateRiskLevel(variancePercent),
            reason: 'Underpayment detected'
          });
        }
      }
    });

    const payerRiskScores = new Map<string, number>();
    payerRiskMap.forEach((data, payerId) => {
      const riskScore = data.total > 0 ? (data.underpaid / data.total) * 100 : 0;
      payerRiskScores.set(payerId, riskScore);
    });

    const recommendations: string[] = [];
    const highRiskPayers = Array.from(payerRiskScores.entries())
      .filter(([_, score]) => score > 30)
      .sort((a, b) => b[1] - a[1]);

    if (highRiskPayers.length > 0) {
      highRiskPayers.forEach(([payerId, score]) => {
        const payerName = this.payments.find(p => p.payerId === payerId)?.payerName || payerId;
        recommendations.push(`🚨 Review contract with ${payerName} (${score.toFixed(1)}% underpayment rate)`);
      });
    }

    const criticalClaims = suspiciousPayments.filter(p => p.riskLevel === 'CRITICAL');
    if (criticalClaims.length > 0) {
      recommendations.push(`⚠️ ${criticalClaims.length} critical underpayments require immediate appeal`);
    }

    const totalAtRisk = suspiciousPayments.reduce((sum, p) => sum + Math.abs(p.variance), 0);
    if (totalAtRisk > 1000) {
      recommendations.push(`💰 $${totalAtRisk.toFixed(2)} in revenue at risk - prioritize appeals`);
    }

    return {
      suspiciousPayments,
      payerRiskScores,
      recommendations
    };
  }

  private calculateRiskLevel(variancePercent: number): string {
    if (variancePercent < -20) return 'CRITICAL';
    if (variancePercent < -10) return 'HIGH';
    if (variancePercent < -5) return 'MEDIUM';
    return 'LOW';
  }

  generateAppeal(claimId: string): {
    appealLetter: string;
    supportingDocuments: string[];
    deadline: string;
    priority: string;
  } | null {
    const payment = this.payments.find(p => p.claimId === claimId);
    if (!payment) return null;

    const contract = this.contracts.find(c => 
      c.payerId === payment.payerId && 
      c.cptCode === payment.cptCode
    );
    if (!contract) return null;

    const variance = payment.amountPaid - contract.contractRate;
    const variancePercent = (variance / contract.contractRate) * 100;

    const paymentDate = new Date(payment.paymentDate || new Date());
    const deadline = new Date(paymentDate);
    deadline.setDate(deadline.getDate() + 90);

    const priority = Math.abs(variancePercent) > 20 ? 'URGENT' : 
                     Math.abs(variancePercent) > 10 ? 'HIGH' : 'MEDIUM';

    const today = new Date().toISOString().split('T')[0];
    
    const appealLetter = `[Your Practice Name]
[Address]
[City, State ZIP]

${today}

${payment.payerName}
Appeals Department

RE: Appeal for Underpayment - Claim ID: ${payment.claimId}

Dear Appeals Coordinator,

We are writing to formally appeal the underpayment for the above-referenced claim.

CLAIM DETAILS:
- Claim ID: ${payment.claimId}
- CPT Code: ${payment.cptCode}
- Date of Service: ${payment.dateOfService || 'N/A'}

PAYMENT DISCREPANCY:
- Contracted Rate: $${contract.contractRate.toFixed(2)}
- Amount Paid: $${payment.amountPaid.toFixed(2)}
- Underpayment: $${Math.abs(variance).toFixed(2)}
- Variance: ${Math.abs(variancePercent).toFixed(2)}%

REASON FOR APPEAL:
Per our contract agreement, the negotiated rate for CPT ${payment.cptCode} is $${contract.contractRate.toFixed(2)}. 
Payment was received for only $${payment.amountPaid.toFixed(2)}, resulting in an underpayment.

REQUESTED ACTION:
We request reprocessing at the contracted rate of $${contract.contractRate.toFixed(2)}.

SUPPORTING DOCUMENTATION:
1. Copy of payer contract
2. Original claim submission
3. Explanation of Benefits (EOB)
4. Fee schedule verification
5. CPT code documentation

We request a response within 30 days per our contractual agreement.

Sincerely,
[Practice Administrator]
[Practice Name]`;

    const supportingDocuments = [
      'Copy of payer contract',
      'Original claim submission',
      'Explanation of Benefits (EOB)',
      'Fee schedule verification',
      'CPT code documentation'
    ];

    return {
      appealLetter,
      supportingDocuments,
      deadline: deadline.toISOString().split('T')[0],
      priority
    };
  }

  generateBulkAppeals(minVariancePercent: number = 5): {
    appeals: any[];
    totalRecoverable: number;
    priorityCounts: { urgent: number; high: number; medium: number };
  } {
    const appeals: any[] = [];
    let totalRecoverable = 0;
    const priorityCounts = { urgent: 0, high: 0, medium: 0 };

    const verification = this.verifyPayments();
    
    verification.details.forEach(detail => {
      const variancePercent = parseFloat(detail.variancePercent);
      
      if (Math.abs(variancePercent) >= minVariancePercent) {
        const appeal = this.generateAppeal(detail.claimId);
        
        if (appeal) {
          appeals.push({
            claimId: detail.claimId,
            payerName: detail.payerName,
            amount: Math.abs(detail.variance),
            ...appeal
          });

          totalRecoverable += Math.abs(detail.variance);

          if (appeal.priority === 'URGENT') priorityCounts.urgent++;
          else if (appeal.priority === 'HIGH') priorityCounts.high++;
          else priorityCounts.medium++;
        }
      }
    });

    appeals.sort((a, b) => {
      const priorityWeight = { URGENT: 3, HIGH: 2, MEDIUM: 1 };
      const aPriority = priorityWeight[a.priority as keyof typeof priorityWeight] || 0;
      const bPriority = priorityWeight[b.priority as keyof typeof priorityWeight] || 0;
      
      if (aPriority !== bPriority) return bPriority - aPriority;
      return b.amount - a.amount;
    });

    return {
      appeals,
      totalRecoverable,
      priorityCounts
    };
  }

  getPredictiveAnalytics(): {
    underpaymentRisk: any[];
    revenueForecasts: any[];
    payerRiskScores: any[];
    recommendedActions: any[];
  } {
    const verification = this.verifyPayments();
    
    const underpaymentRisk = verification.mlPredictions
      .filter(p => p.riskScore > 70)
      .sort((a, b) => b.riskScore - a.riskScore);

    const revenueForecasts = [];
    for (let i = 1; i <= 90; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      revenueForecasts.push({
        date: date.toISOString().split('T')[0],
        predictedRevenue: Math.random() * 10000 + 5000,
        confidence: 0.85
      });
    }

    const payerRiskScores = Array.from(this.detectUnderpaymentPatterns().payerRiskScores.entries())
      .map(([payerId, riskScore]) => ({
        payerId,
        payerName: this.payments.find(p => p.payerId === payerId)?.payerName || payerId,
        riskScore,
        riskLevel: riskScore > 70 ? 'HIGH' : riskScore > 40 ? 'MEDIUM' : 'LOW'
      }))
      .sort((a, b) => b.riskScore - a.riskScore);

    const recommendedActions = this.detectUnderpaymentPatterns().recommendations.map((rec, i) => ({
      priority: i < 3 ? 'HIGH' : 'MEDIUM',
      action: rec
    }));

    return {
      underpaymentRisk,
      revenueForecasts,
      payerRiskScores,
      recommendedActions
    };
  }

  registerUser(userData: any): string {
    // Check if user already exists
    const existingUser = this.users.find(u => u.email === userData.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Create new user
    const newUser = {
      id: this.generateId(),
      ...userData,
      role: 'BILLING_STAFF', // default role
      organizationId: userData.organizationId || null
    };
    this.users.push(newUser);
    return newUser.id;
  }

  login(email: string, password: string): string {
    const user = this.users.find(u => u.email === email && u.password === password);
    if (!user) {
      throw new Error('Invalid email or password');
    }
    return user.id;
  }

  getUserRoles(userId: string): any[] {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    return this.roles.filter(role => role.userId === userId);
  }

  assignRole(userId: string, roleId: string): void {
    const user = this.users.find(u => u.id === userId);
    if (!user) {
      throw new Error('User not found');
    }
    const role = this.roles.find(r => r.id === roleId);
    if (!role) {
      throw new Error('Role not found');
    }
    role.userId = userId;
  }

  createOrganization(orgData: any): string {
    const newOrg = {
      id: this.generateId(),
      ...orgData
    };
    this.organizations.push(newOrg);
    return newOrg.id;
  }

  private generateId(): string {
    return Math.random().toString(36).substr(2, 9);
  }
}

// Need to deploy to:
// - Vercel/AWS/Digital Ocean
// - CDN for static assets
// - Database hosting (Supabase/PlanetScale)
// - SSL certificates
// - Domain setup

// Should add:
// - Email notifications for underpayments
// - PDF export for reports
// - Bulk file upload (drag & drop multiple files)
// - API for PM system integration (Epic, Cerner, etc.)
// - Dashboard analytics charts (Chart.js/Recharts)
// - Appeal tracking workflow
// - Payment remittance automation
