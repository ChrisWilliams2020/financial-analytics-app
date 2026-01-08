import { NextResponse } from 'next/server';

export async function GET() {
  const payers = [
    'Independence Blue Cross',
    'Aetna',
    'UnitedHealthcare',
    'Cigna',
    'Humana',
    'Medicare',
    'Medicaid (PA)',
    'Horizon BCBS',
    'AmeriHealth',
    'Kaiser Permanente',
  ];
  return NextResponse.json(payers);
}
