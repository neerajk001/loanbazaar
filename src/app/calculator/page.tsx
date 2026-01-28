'use client';
export const dynamic = 'force-dynamic';
import React, { useState, useEffect, Suspense } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Calculator as CalculatorIcon, TrendingUp, Wallet, Calendar, Percent, IndianRupee, ArrowRight, Sparkles, PiggyBank, Target, Clock, RefreshCw, Percent as PercentIcon, Plus, Trash2, CheckCircle2, ChevronDown, ChevronRight, ChevronLeft, Minus, Download } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const DetailedCalculatorContent = () => {
  // Custom formatter for PDF that doesn't use toLocaleString (causes rendering issues in jsPDF)
  const formatForPDF = (num: number): string => {
    const str = Math.round(num).toString();
    const lastThree = str.substring(str.length - 3);
    const otherNumbers = str.substring(0, str.length - 3);
    if (otherNumbers !== '') {
      return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + ',' + lastThree;
    }
    return lastThree;
  };

  const searchParams = useSearchParams();
  // Determine initial tab
  const getInitialTab = () => {
    const tab = searchParams.get('tab');
    if (tab === 'balance' || tab === 'part-payment' || tab === 'eligibility') return tab;
    return 'emi';
  };
  
  const [activeTab, setActiveTab] = useState<'emi' | 'balance' | 'part-payment' | 'eligibility'>(getInitialTab());

  // Update activeTab if searchParams change
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'balance' || tab === 'part-payment' || tab === 'eligibility' || tab === 'emi') {
      setActiveTab(tab);
    }
  }, [searchParams]);

  // EMI Calculator State
  const [loanAmount, setLoanAmount] = useState(1000000); // Default: 10 Lakhs
  const [interestRate, setInterestRate] = useState(10.5); // Default: 10.5%
  const [tenure, setTenure] = useState(5); // Default: 5 years
  const [tenureType, setTenureType] = useState<'years' | 'months'>('years');
  
  const [emi, setEmi] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalPayment, setTotalPayment] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [amortizationSchedule, setAmortizationSchedule] = useState<any[]>([]);
  const [expandedYears, setExpandedYears] = useState<number[]>([]);

  // EMI Pagination
  const [emiCurrentPage, setEmiCurrentPage] = useState(1);
  const emiItemsPerPage = 5; // Show 5 years per page
  
  // Calculate pagination values for EMI
  const emiTotalPages = Math.ceil(amortizationSchedule.length / emiItemsPerPage);
  const emiStartIndex = (emiCurrentPage - 1) * emiItemsPerPage;
  const emiEndIndex = emiStartIndex + emiItemsPerPage;
  const emiCurrentData = amortizationSchedule.slice(emiStartIndex, emiEndIndex);

  // Reset to page 1 when schedule changes
  useEffect(() => {
    setEmiCurrentPage(1);
  }, [amortizationSchedule.length]);

  // Eligibility Calculator State
  const [income, setIncome] = useState<string>('50000'); // Default: 50k
  const [existingEmi, setExistingEmi] = useState<string>('10000'); // Default: 10k
  const [eligTenure, setEligTenure] = useState<string>('5'); // Default: 5 years
  const [eligibleAmount, setEligibleAmount] = useState(0);
  const [maxEmiCapacity, setMaxEmiCapacity] = useState(0);
  const [applicableROI, setApplicableROI] = useState(11.0);

  // Balance Transfer State
  const [btIncome, setBtIncome] = useState(0);
  const [outstanding, setOutstanding] = useState(0);
  const [btExistingEmi, setBtExistingEmi] = useState(0);
  const [btTenure, setBtTenure] = useState(1);
  
  // BT Results
  const [btMaxEmi, setBtMaxEmi] = useState(0);
  const [btPerLakhEmi, setBtPerLakhEmi] = useState(0);
  const [btMaxLoan, setBtMaxLoan] = useState(0);
  const [btNetInHand, setBtNetInHand] = useState(0);

  // Part Payment State
  const [ppLoanAmount, setPpLoanAmount] = useState(1000000); // Default: 10 Lakhs
  const [ppInterestRate, setPpInterestRate] = useState(10.5); // Default: 10.5%
  const [ppTenure, setPpTenure] = useState(5); // Default: 5 years
  const [ppReductionType, setPpReductionType] = useState<'emi' | 'tenure'>('emi');
  const [partPayments, setPartPayments] = useState<{ amount: number; month: number }[]>([]);

  // Part Payment Results
  const [ppResults, setPpResults] = useState({
    originalInterest: 0,
    newInterest: 0,
    savings: 0,
    newTenureYears: 0,
    newTenureMonths: 0,
    schedule: [] as any[]
  });

  // Part Payment Pagination
  const [ppCurrentPage, setPpCurrentPage] = useState(1);
  const ppItemsPerPage = 12;
  
  // Calculate pagination values
  const ppTotalPages = Math.ceil(ppResults.schedule.length / ppItemsPerPage);
  const ppStartIndex = (ppCurrentPage - 1) * ppItemsPerPage;
  const ppEndIndex = ppStartIndex + ppItemsPerPage;
  const ppCurrentData = ppResults.schedule.slice(ppStartIndex, ppEndIndex);

  // Reset to page 1 when schedule changes
  useEffect(() => {
    setPpCurrentPage(1);
  }, [ppResults.schedule.length]);

  // EMI Calculation
  useEffect(() => {
    calculateEMI();
  }, [loanAmount, interestRate, tenure, tenureType]);

  const calculateEMI = () => {
    const principal = loanAmount;
    const ratePerMonth = interestRate / 12 / 100;
    const numberOfMonths = tenureType === 'years' ? tenure * 12 : tenure;

    let monthlyEmi = 0;
    let totalInt = 0;

    if (ratePerMonth === 0) {
      monthlyEmi = principal / numberOfMonths;
      totalInt = 0;
    } else {
      monthlyEmi = (principal * ratePerMonth * Math.pow(1 + ratePerMonth, numberOfMonths)) / 
                   (Math.pow(1 + ratePerMonth, numberOfMonths) - 1);
    }

    const totalPay = monthlyEmi * numberOfMonths;
    totalInt = totalPay - principal;

    setEmi(Math.round(monthlyEmi));
    setTotalInterest(Math.round(totalInt));
    setTotalPayment(Math.round(totalPay));

    setChartData([
      { name: 'Principal', value: principal },
      { name: 'Interest', value: Math.round(totalInt) },
    ]);

    // Generate Amortization Schedule with monthly breakdown
    let balance = principal;
    const yearlySchedule: any[] = [];
    let currentYearInterest = 0;
    let currentYearPrincipal = 0;
    let currentYearMonths: any[] = [];
    let totalPrincipalPaid = 0;
    
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    // Calculate start year (current year)
    const startYear = new Date().getFullYear();
    
    for (let i = 1; i <= numberOfMonths; i++) {
      const interestForMonth = balance * ratePerMonth;
      const principalForMonth = monthlyEmi - interestForMonth;
      balance -= principalForMonth;
      totalPrincipalPaid += principalForMonth;

      currentYearInterest += interestForMonth;
      currentYearPrincipal += principalForMonth;
      
      // Calculate loan paid percentage
      const loanPaidPercent = (totalPrincipalPaid / principal) * 100;
      
      // Get month index (0-11) within the year
      const monthIndex = (i - 1) % 12;
      
      // Store monthly data
      currentYearMonths.push({
        month: monthNames[monthIndex],
        principal: Math.round(principalForMonth),
        interest: Math.round(interestForMonth),
        emi: Math.round(monthlyEmi),
        balance: Math.max(0, Math.round(balance)),
        loanPaidPercent: loanPaidPercent.toFixed(2)
      });

      if (i % 12 === 0 || i === numberOfMonths) {
        const yearNumber = Math.ceil(i / 12);
        const actualYear = startYear + yearNumber - 1;
        yearlySchedule.push({
          year: yearNumber,
          actualYear: actualYear,
          principal: Math.round(currentYearPrincipal),
          interest: Math.round(currentYearInterest),
          totalEmi: Math.round(monthlyEmi * Math.min(12, i - (yearNumber - 1) * 12)),
          balance: Math.max(0, Math.round(balance)),
          loanPaidPercent: loanPaidPercent.toFixed(2),
          months: [...currentYearMonths]
        });
        currentYearInterest = 0;
        currentYearPrincipal = 0;
        currentYearMonths = [];
      }
    }
    setAmortizationSchedule(yearlySchedule);
  };

  const downloadEmiPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    const logo = new Image();
    logo.src = '/logo.jpeg';

    const drawSummary = (startY: number) => {
        // Enhanced Summary Box
        doc.setFillColor(240, 248, 255);
        doc.roundedRect(14, startY, 182, 52, 3, 3, 'F');
        
        // Title
        doc.setFontSize(13);
        doc.setTextColor(30, 58, 138);
        doc.setFont('helvetica', 'bold');
        doc.text('Loan Summary', 20, startY + 8);

        // Loan Amount
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');
        doc.text('Loan Amount', 20, startY + 18);
        doc.setFontSize(12);
        doc.setTextColor(30, 58, 138);
        doc.setFont('helvetica', 'bold');
        doc.text(`Rs ${formatForPDF(loanAmount)}`, 20, startY + 25);

        // Interest Rate
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');
        doc.text('Interest Rate', 85, startY + 18);
        doc.setFontSize(12);
        doc.setTextColor(234, 88, 12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${interestRate}% p.a.`, 85, startY + 25);

        // Tenure
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');
        doc.text('Tenure', 140, startY + 18);
        doc.setFontSize(12);
        doc.setTextColor(30, 58, 138);
        doc.setFont('helvetica', 'bold');
        doc.text(`${tenure} ${tenureType}`, 140, startY + 25);

        // EMI Box
        doc.setFillColor(255, 248, 230);
        doc.roundedRect(18, startY + 32, 54, 13, 2, 2, 'F');
        doc.setFontSize(8);
        doc.setTextColor(100, 80, 0);
        doc.setFont('helvetica', 'normal');
        doc.text('Monthly EMI', 22, startY + 38);
        doc.setFontSize(10);
        doc.setTextColor(180, 120, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(`Rs ${formatForPDF(emi)}`, 22, startY + 43);

        // Interest Box
        doc.setFillColor(255, 240, 240);
        doc.roundedRect(76, startY + 32, 56, 13, 2, 2, 'F');
        doc.setFontSize(8);
        doc.setTextColor(100, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.text('Total Interest', 80, startY + 38);
        doc.setFontSize(10);
        doc.setTextColor(200, 50, 50);
        doc.setFont('helvetica', 'bold');
        doc.text(`Rs ${formatForPDF(totalInterest)}`, 80, startY + 43);

        // Total Box
        doc.setFillColor(230, 255, 230);
        doc.roundedRect(136, startY + 32, 56, 13, 2, 2, 'F');
        doc.setFontSize(8);
        doc.setTextColor(0, 100, 0);
        doc.setFont('helvetica', 'normal');
        doc.text('Total Payment', 140, startY + 38);
        doc.setFontSize(10);
        doc.setTextColor(0, 150, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(`Rs ${formatForPDF(totalPayment)}`, 140, startY + 43);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
    };

    const generateTable = (startY: number) => {
        drawSummary(startY);
        
        const tableStartY = startY + 60;

        doc.setFontSize(12);
        doc.setTextColor(30, 58, 138);
        doc.setFont('helvetica', 'bold');
        doc.text('Monthly Repayment Schedule', 14, tableStartY - 4);

        const tableRows: any[] = [];
        
        amortizationSchedule.forEach(yearData => {
          tableRows.push([
            { content: `${yearData.actualYear}`, colSpan: 6, styles: { fillColor: [30, 58, 138], textColor: [255, 255, 255], fontStyle: 'bold', fontSize: 9.5 } }
          ]);
          
          yearData.months.forEach((month: any) => {
            tableRows.push([
              month.month,
              `Rs ${formatForPDF(month.principal)}`,
              `Rs ${formatForPDF(month.interest)}`,
              `Rs ${formatForPDF(month.emi)}`,
              `Rs ${formatForPDF(month.balance)}`,
              `${month.loanPaidPercent}%`
            ]);
          });
        });

        autoTable(doc, {
          head: [['Month', 'Principal (Rs)', 'Interest (Rs)', 'EMI (Rs)', 'Balance (Rs)', 'Paid %']],
          body: tableRows,
          startY: tableStartY,
          theme: 'striped',
          styles: { fontSize: 8, cellPadding: 2.5, halign: 'right' },
          columnStyles: {
            0: { halign: 'center', fontStyle: 'bold' },
            1: { halign: 'right' },
            2: { halign: 'right' },
            3: { halign: 'right' },
            4: { halign: 'right' },
            5: { halign: 'right' }
          },
          headStyles: { 
            fillColor: [30, 58, 138], 
            textColor: [255, 255, 255], 
            fontStyle: 'bold',
            fontSize: 9,
            halign: 'right'
          },
          alternateRowStyles: { fillColor: [245, 250, 255] },
          didDrawPage: (data) => {
            doc.setFontSize(8);
            doc.setTextColor(150, 150, 150);
            doc.text(
              `Page ${data.pageNumber} | Generated on ${new Date().toLocaleDateString('en-IN')}`,
              pageWidth / 2,
              pageHeight - 10,
              { align: 'center' }
            );
          }
        });

        doc.save(`EMI-Repayment-Schedule-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    logo.onload = () => {
        doc.addImage(logo, 'JPEG', 14, 10, 35, 13);
        
        doc.setFontSize(19);
        doc.setTextColor(30, 58, 138);
        doc.setFont('helvetica', 'bold');
        doc.text('EMI Calculator Report', 196, 17, { align: 'right' });
        
        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, 196, 23, { align: 'right' });

        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(14, 27, 196, 27);

        generateTable(32);
    };

    logo.onerror = () => {
        doc.setFontSize(19);
        doc.setTextColor(30, 58, 138);
        doc.setFont('helvetica', 'bold');
        doc.text('EMI Calculator Report', 14, 17);
        
        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 23);
        
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(14, 27, 196, 27);
        
        generateTable(32);
    };
  };
  
  // Toggle year expansion
  const toggleYearExpansion = (year: number) => {
    setExpandedYears(prev => 
      prev.includes(year) 
        ? prev.filter(y => y !== year)
        : [...prev, year]
    );
  };

  // Eligibility Calculation
  useEffect(() => {
    const incomeNum = Number(income) || 0;
    const existingEmiNum = Number(existingEmi) || 0;
    const eligTenureNum = Number(eligTenure) || 1;
    
    const foir = 0.50;
    const maxMonthlyEmi = (incomeNum * foir) - existingEmiNum;
    setMaxEmiCapacity(Math.round(Math.max(0, maxMonthlyEmi)));
    
    // Calculate Loan Amount for this Max EMI
    // Formula: P = (E * ( (1+r)^n - 1 ) ) / ( r * (1+r)^n )
    const r = applicableROI / 12 / 100;
    const n = eligTenureNum * 12; // tenure in months

    let loan = 0;
    if (maxMonthlyEmi > 0) {
      loan = maxMonthlyEmi * ( (Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)) );
    }

    setEligibleAmount(Math.round(Math.max(0, loan)));
  }, [income, existingEmi, eligTenure, applicableROI]);

  // Balance Transfer Calculation
  useEffect(() => {
    // Constants
    const BT_RATE = 10.5;
    const FOIR = 0.70; // 70% based on user requirement

    // 1. Calculate Max EMI Capacity
    const maxCapacity = (btIncome * FOIR) - btExistingEmi;
    setBtMaxEmi(Math.max(0, Math.round(maxCapacity)));

    // 2. Calculate Per Lakh EMI
    // EMI for 1,00,000 at 10.5% for btTenure years
    const r = BT_RATE / 12 / 100;
    const n = btTenure * 12;
    
    let perLakh = 0;
    if (r > 0 && n > 0) {
      perLakh = 100000 * r * (Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1));
    }
    setBtPerLakhEmi(Math.round(perLakh));

    // 3. Calculate Max Loan Amount
    // Derived from Max EMI Capacity using the same rate and tenure
    let maxLoan = 0;
    if (maxCapacity > 0 && r > 0 && n > 0) {
      maxLoan = maxCapacity * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));
    }
    setBtMaxLoan(Math.round(maxLoan));

    // 4. Net In Hand
    const net = Math.max(0, maxLoan - outstanding);
    setBtNetInHand(Math.round(net));

  }, [btIncome, outstanding, btExistingEmi, btTenure]);

  const downloadPartPaymentPDF = () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    
    const logo = new Image();
    logo.src = '/logo.jpeg';

    const generateSchedule = (startY: number) => {
        // Loan Summary Box
        doc.setFillColor(240, 248, 255);
        doc.roundedRect(14, startY, 182, 48, 3, 3, 'F');
        
        doc.setFontSize(13);
        doc.setTextColor(30, 58, 138);
        doc.setFont('helvetica', 'bold');
        doc.text('Loan Details', 20, startY + 8);

        // Loan Amount
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');
        doc.text('Loan Amount', 20, startY + 18);
        doc.setFontSize(12);
        doc.setTextColor(30, 58, 138);
        doc.setFont('helvetica', 'bold');
        doc.text(`Rs ${formatForPDF(ppLoanAmount)}`, 20, startY + 25);

        // Interest Rate
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');
        doc.text('Interest Rate', 90, startY + 18);
        doc.setFontSize(12);
        doc.setTextColor(234, 88, 12);
        doc.setFont('helvetica', 'bold');
        doc.text(`${ppInterestRate}% p.a.`, 90, startY + 25);

        // Tenure
        doc.setFontSize(9);
        doc.setTextColor(100, 100, 100);
        doc.setFont('helvetica', 'normal');
        doc.text('Tenure', 145, startY + 18);
        doc.setFontSize(12);
        doc.setTextColor(30, 58, 138);
        doc.setFont('helvetica', 'bold');
        doc.text(`${ppTenure} Years`, 145, startY + 25);

        // Interest Savings Box
        doc.setFillColor(255, 248, 230);
        doc.roundedRect(18, startY + 32, 58, 11, 2, 2, 'F');
        doc.setFontSize(8);
        doc.setTextColor(100, 80, 0);
        doc.setFont('helvetica', 'normal');
        doc.text('Interest With Prepay', 22, startY + 37);
        doc.setFontSize(9);
        doc.setTextColor(180, 120, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(`Rs ${formatForPDF(ppResults.newInterest)}`, 22, startY + 42);

        // Original Interest Box
        doc.setFillColor(255, 240, 240);
        doc.roundedRect(80, startY + 32, 58, 11, 2, 2, 'F');
        doc.setFontSize(8);
        doc.setTextColor(100, 0, 0);
        doc.setFont('helvetica', 'normal');
        doc.text('Interest Without', 84, startY + 37);
        doc.setFontSize(9);
        doc.setTextColor(200, 50, 50);
        doc.setFont('helvetica', 'bold');
        doc.text(`Rs ${formatForPDF(ppResults.originalInterest)}`, 84, startY + 42);

        // Total Savings Box
        doc.setFillColor(230, 255, 230);
        doc.roundedRect(142, startY + 32, 50, 11, 2, 2, 'F');
        doc.setFontSize(8);
        doc.setTextColor(0, 100, 0);
        doc.setFont('helvetica', 'normal');
        doc.text('Total Savings', 146, startY + 37);
        doc.setFontSize(10);
        doc.setTextColor(0, 150, 0);
        doc.setFont('helvetica', 'bold');
        doc.text(`Rs ${formatForPDF(ppResults.savings)}`, 146, startY + 42);

        // Part Payments Summary
        if (partPayments.length > 0) {
            doc.setFontSize(11);
            doc.setTextColor(30, 58, 138);
            doc.setFont('helvetica', 'bold');
            doc.text('Part Payment Schedule:', 14, startY + 56);
            
            doc.setFontSize(9);
            doc.setFont('helvetica', 'normal');
            doc.setTextColor(80, 80, 80);
            let yPos = startY + 64;
            partPayments.forEach((pp, index) => {
                doc.text(`Payment ${index + 1}: Rs ${formatForPDF(pp.amount)} at Month ${pp.month}`, 18, yPos);
                yPos += 6;
            });
            
            yPos += 2;
            
            // Reduction Type Info
            doc.setFillColor(245, 250, 255);
            doc.roundedRect(14, yPos, 182, 10, 2, 2, 'F');
            doc.setFontSize(9);
            doc.setTextColor(30, 58, 138);
            doc.setFont('helvetica', 'bold');
            doc.text(`Reduction Type: ${ppReductionType === 'emi' ? 'EMI Reduction' : 'Tenure Reduction'}`, 18, yPos + 6);
        }

        // Amortization Schedule Table
        if (ppResults.schedule.length > 0) {
            const tableStartY = startY + 82 + (partPayments.length * 6);
            
            doc.setFontSize(12);
            doc.setTextColor(30, 58, 138);
            doc.setFont('helvetica', 'bold');
            doc.text('Amortization Schedule with Part Payments', 14, tableStartY);
            
            const tableRows: any[] = [];
            ppResults.schedule.forEach((row: any) => {
                tableRows.push([
                    row.month,
                    row.partPayment > 0 ? `Rs ${formatForPDF(row.partPayment)}` : '-',
                    `Rs ${formatForPDF(row.balance)}`,
                    `Rs ${formatForPDF(row.emi)}`
                ]);
            });

            autoTable(doc, {
                head: [['Month', 'Part Payment (Rs)', 'Balance (Rs)', 'EMI (Rs)']],
                body: tableRows,
                startY: tableStartY + 6,
                theme: 'striped',
                styles: { fontSize: 8, cellPadding: 2.5, halign: 'right' },
                columnStyles: {
                    0: { halign: 'center', fontStyle: 'bold' },
                    1: { halign: 'right', textColor: [234, 88, 12] },
                    2: { halign: 'right' },
                    3: { halign: 'right' }
                },
                headStyles: { 
                    fillColor: [30, 58, 138], 
                    textColor: [255, 255, 255], 
                    fontStyle: 'bold',
                    fontSize: 9,
                    halign: 'right'
                },
                alternateRowStyles: { fillColor: [245, 250, 255] },
                didDrawPage: (data) => {
                    doc.setFontSize(8);
                    doc.setTextColor(150, 150, 150);
                    doc.text(
                        `Page ${data.pageNumber} | Generated on ${new Date().toLocaleDateString('en-IN')}`,
                        pageWidth / 2,
                        pageHeight - 10,
                        { align: 'center' }
                    );
                }
            });
        }
    };

    logo.onload = () => {
        doc.addImage(logo, 'JPEG', 14, 10, 35, 13);
        
        doc.setFontSize(18);
        doc.setTextColor(30, 58, 138);
        doc.setFont('helvetica', 'bold');
        doc.text('Part Payment Analysis', 196, 17, { align: 'right' });
        
        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated: ${new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })}`, 196, 23, { align: 'right' });

        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(14, 27, 196, 27);

        generateSchedule(32);
        doc.save(`Part-Payment-Analysis-${new Date().toISOString().split('T')[0]}.pdf`);
    };

    logo.onerror = () => {
        doc.setFontSize(18);
        doc.setTextColor(30, 58, 138);
        doc.setFont('helvetica', 'bold');
        doc.text('Part Payment Analysis', 14, 17);
        
        doc.setFontSize(9);
        doc.setTextColor(120, 120, 120);
        doc.setFont('helvetica', 'normal');
        doc.text(`Generated: ${new Date().toLocaleDateString('en-IN')}`, 14, 23);
        
        doc.setDrawColor(200, 200, 200);
        doc.setLineWidth(0.3);
        doc.line(14, 27, 196, 27);
        
        generateSchedule(32);
        doc.save(`Part-Payment-Analysis-${new Date().toISOString().split('T')[0]}.pdf`);
    };
  };

  // Part Payment Calculation
  // Helper function to calculate new tenure after part payment
  const calculateNewTenure = (principal: number, emi: number, ratePerMonth: number): number => {
    if (ratePerMonth === 0 || emi === 0 || principal <= 0) return 0;
    
    // Formula: n = log(EMI / (EMI - P*R)) / log(1 + R)
    // Where: P = principal, R = ratePerMonth, EMI = monthly payment
    const monthlyInterest = principal * ratePerMonth;
    const denominator = emi - monthlyInterest;
    
    if (denominator <= 0) {
      // EMI is too small to cover interest, tenure would be infinite
      return 0;
    }
    
    const ratio = emi / denominator;
    if (ratio <= 1) {
      // Invalid ratio - EMI must be greater than monthly interest
      return 0;
    }
    
    const newTenure = Math.log(ratio) / Math.log(1 + ratePerMonth);
    const roundedTenure = Math.ceil(newTenure);
    
    // Ensure tenure is positive and reasonable
    return roundedTenure > 0 ? roundedTenure : 0;
  };

  const calculatePartPayment = () => {
    const ratePerMonth = ppInterestRate / 12 / 100;
    const totalMonths = ppTenure * 12;
    
    // Calculate Base EMI (Original)
    let baseEmi = 0;
    if (ratePerMonth > 0) {
      baseEmi = (ppLoanAmount * ratePerMonth * Math.pow(1 + ratePerMonth, totalMonths)) / 
                (Math.pow(1 + ratePerMonth, totalMonths) - 1);
    }

    // Original Interest
    const totalOriginalPayment = baseEmi * totalMonths;
    const originalInterest = totalOriginalPayment - ppLoanAmount;

    // Filter and sort part payments by month (only include valid payments with amount > 0)
    const validPartPayments = partPayments
      .filter(p => p.amount > 0 && p.month >= 0)
      .sort((a, b) => a.month - b.month);

    // Simulation
    let balance = ppLoanAmount;
    let totalInterestPaid = 0;
    let currentEmi = baseEmi;
    let remainingMonths = totalMonths;
    const schedule = [];
    let monthsPassed = 0;
    const maxMonths = totalMonths * 2; // Safety limit to prevent infinite loops

    // Handle part payment at month 0 (before first EMI)
    const ppAtMonth0 = validPartPayments.find(p => p.month === 0)?.amount || 0;
    const initialBalance = balance;
    if (ppAtMonth0 > 0) {
      balance = balance - ppAtMonth0;
      if (balance < 0) balance = 0;
      
      // Recalculate EMI if needed after month 0 part payment
      if (ppReductionType === 'emi' && balance > 0) {
        remainingMonths = totalMonths;
        if (remainingMonths > 0 && ratePerMonth > 0) {
          currentEmi = (balance * ratePerMonth * Math.pow(1 + ratePerMonth, remainingMonths)) / 
                       (Math.pow(1 + ratePerMonth, remainingMonths) - 1);
        }
      }
    }

    for (let m = 1; m <= maxMonths && balance > 0; m++) {
      // Check for Part Payment at this month
      const pp = validPartPayments.find(p => p.month === m)?.amount || 0;
      
      const interestForMonth = balance * ratePerMonth;
      const principalForMonth = currentEmi - interestForMonth;
      
      let closingBalance = balance - principalForMonth - pp;
      
      if (closingBalance < 0) closingBalance = 0;

      totalInterestPaid += interestForMonth;
      monthsPassed = m;

      schedule.push({
        month: m,
        partPayment: pp,
        balance: Math.round(closingBalance),
        emi: Math.round(currentEmi)
      });

      balance = closingBalance;

      if (balance <= 0) break;

      // Handle reduction type
      if (ppReductionType === 'emi') {
        // Reduce EMI: Recalculate EMI with remaining months
        if (pp > 0) {
          remainingMonths = totalMonths - m;
          if (remainingMonths > 0 && ratePerMonth > 0) {
            currentEmi = (balance * ratePerMonth * Math.pow(1 + ratePerMonth, remainingMonths)) / 
                         (Math.pow(1 + ratePerMonth, remainingMonths) - 1);
          }
        } else {
          remainingMonths = totalMonths - m;
        }
      } else if (ppReductionType === 'tenure') {
        // Reduce Tenure: Keep EMI same, recalculate remaining months after part payment
        if (pp > 0) {
          const newRemainingMonths = calculateNewTenure(balance, currentEmi, ratePerMonth);
          if (newRemainingMonths > 0) {
            remainingMonths = newRemainingMonths;
            // Check if we can finish early
            if (m + remainingMonths <= maxMonths) {
              // Continue with reduced tenure
            }
          }
        }
        // For tenure reduction, EMI stays constant, loop continues until balance is 0
      }
    }

    const savings = originalInterest - totalInterestPaid;
    const newTenureYears = Math.floor(monthsPassed / 12);
    const newTenureMonths = monthsPassed % 12;

    // Add month 0 to schedule if there's a part payment at month 0
    if (ppAtMonth0 > 0) {
      schedule.unshift({
        month: 0,
        partPayment: ppAtMonth0,
        balance: Math.round(balance),
        emi: 0
      });
    }

    setPpResults({
      originalInterest: Math.round(originalInterest),
      newInterest: Math.round(totalInterestPaid),
      savings: Math.round(savings),
      newTenureYears,
      newTenureMonths,
      schedule
    });
  };

  useEffect(() => {
    calculatePartPayment();
  }, [ppLoanAmount, ppInterestRate, ppTenure, ppReductionType, partPayments]);

  const addPartPaymentRow = () => {
    setPartPayments([...partPayments, { amount: 0, month: 0 }]);
  };

  const updatePartPayment = (index: number, field: 'amount' | 'month', value: number) => {
    const newPayments = [...partPayments];
    newPayments[index] = { ...newPayments[index], [field]: value };
    setPartPayments(newPayments);
  };

  const removePartPayment = (index: number) => {
    const newPayments = partPayments.filter((_, i) => i !== index);
    setPartPayments(newPayments);
  };

  const COLORS = ['#3b82f6', '#f59e0b'];

  const interestPercentage = totalPayment > 0 ? Math.round((totalInterest / totalPayment) * 100) : 0;
  const principalPercentage = 100 - interestPercentage;

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white font-sans">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-white p-1 rounded-xl shadow-sm border border-gray-200 inline-flex overflow-x-auto max-w-full">
            <button
              onClick={() => setActiveTab('emi')}
              className={`flex items-center gap-2 px-6 py-6 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'emi'
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'text-gray-500 hover:text-blue-900 hover:bg-blue-50'
              }`}
            >
              <CalculatorIcon className="w-4 h-4" />
              EMI Calculator
            </button>
            <button
              onClick={() => setActiveTab('eligibility')}
              className={`flex items-center gap-2 px-6 py-6 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'eligibility'
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'text-gray-500 hover:text-blue-900 hover:bg-blue-50'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
              Check Eligibility
            </button>
            <button
              onClick={() => setActiveTab('balance')}
              className={`flex items-center gap-2 px-6 py-6 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'balance'
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'text-gray-500 hover:text-blue-900 hover:bg-blue-50'
              }`}
            >
              <RefreshCw className="w-4 h-4" />
              Balance Transfer
            </button>
            <button
              onClick={() => setActiveTab('part-payment')}
              className={`flex items-center gap-2 px-6 py-6 rounded-lg text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === 'part-payment'
                  ? 'bg-blue-900 text-white shadow-md'
                  : 'text-gray-500 hover:text-blue-900 hover:bg-blue-50'
              }`}
            >
              <PercentIcon className="w-4 h-4" />
              Part Payment
            </button>
          </div>
        </div>

        {/* EMI Calculator View */}
        {activeTab === 'emi' && (
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            
            {/* Main Calculator Input - Large Card */}
            <div className="col-span-12 lg:col-span-7 bg-blue-50/30 border border-blue-100 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <CalculatorIcon className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-blue-900">Loan Details</h2>
                  <p className="text-gray-500 text-sm">Adjust the values to calculate EMI</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Loan Amount */}
                <SliderInput 
                  label="Loan Amount" 
                  value={loanAmount} 
                  setValue={setLoanAmount} 
                  min={100000} 
                  max={10000000} 
                  step={10000} 
                  prefix="₹"
                  description="The principal amount you want to borrow"
                />
                {/* Interest Rate */}
                <SliderInput 
                  label="Interest Rate (p.a.)" 
                  value={interestRate} 
                  setValue={setInterestRate} 
                  min={5} 
                  max={20} 
                  step={0.1} 
                  suffix="%"
                  description="Annual interest rate charged by the lender"
                />
                {/* Tenure */}
                <div className="space-y-4">
                   <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <label className="flex items-center gap-2 text-gray-700 font-medium mb-1">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        Loan Tenure
                      </label>
                      <p className="text-xs text-gray-500 font-semibold mt-0.5 ml-6">Duration over which you will repay the loan</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex bg-gray-100 rounded-xl p-1">
                        <button 
                          onClick={() => setTenureType('years')}
                          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${tenureType === 'years' ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-500'}`}
                        >
                          Years
                        </button>
                        <button 
                          onClick={() => setTenureType('months')}
                          className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${tenureType === 'months' ? 'bg-white text-blue-900 shadow-sm' : 'text-gray-500'}`}
                        >
                          Months
                        </button>
                      </div>
                      <div className="bg-gray-100 px-4 py-2 rounded-xl border border-gray-200 w-20 text-center">
                        <input 
                          type="number" 
                          value={tenure}
                          onChange={(e) => setTenure(Number(e.target.value))}
                          className="bg-transparent text-center w-full focus:outline-none font-bold text-blue-900"
                        />
                      </div>
                    </div>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max={tenureType === 'years' ? 30 : 360} 
                    step="1" 
                    value={tenure} 
                    onChange={(e) => setTenure(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-orange-600"
                  />
                  <div className="flex justify-between text-xs text-gray-400 mt-2">
                    <span>1 {tenureType === 'years' ? 'Year' : 'Month'}</span>
                    <span>{tenureType === 'years' ? '30 Years' : '360 Months'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column Wrapper */}
            <div className="col-span-12 lg:col-span-5 flex flex-col gap-4 md:gap-6">
              {/* EMI Result - Featured Card */}
              <div className="bg-blue-900 border border-blue-900 rounded-3xl p-5 md:p-6 text-white relative overflow-hidden h-fit">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative">
                  <div className="flex items-center gap-2 text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">
                    <Sparkles className="w-3 h-3" />
                    MONTHLY EMI
                  </div>
                  <div className="text-3xl md:text-4xl font-bold mb-3">
                    ₹{formatCurrency(emi)}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-white/10 rounded-xl p-2.5">
                      <div className="text-blue-200 text-[10px] uppercase font-bold mb-0.5">Total Interest</div>
                      <div className="text-base font-bold">₹{formatCurrency(totalInterest)}</div>
                    </div>
                    <div className="bg-white/10 rounded-xl p-2.5">
                      <div className="text-blue-200 text-[10px] uppercase font-bold mb-0.5">Total Payment</div>
                      <div className="text-base font-bold">₹{formatCurrency(totalPayment)}</div>
                    </div>
                  </div>

                  <Link 
                    href="/apply"
                    className="flex items-center justify-center gap-2 w-full bg-orange-600 text-white py-2.5 rounded-xl font-bold hover:bg-orange-700 transition-colors shadow-lg text-sm"
                  >
                    Apply for this Loan
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Eligibility Check CTA */}
              <div className="flex-1 bg-blue-900 border border-blue-900 rounded-3xl p-5 md:p-6 text-white relative overflow-hidden min-h-[200px] flex flex-col justify-center">
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl" />
                <div className="relative">
                  <div className="flex items-center gap-3 mb-3">
                     <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center">
                       <Wallet className="w-5 h-5 text-white" />
                     </div>
                     <h3 className="text-lg font-bold">Check Eligibility</h3>
                  </div>
                  <p className="text-blue-200 text-sm mb-4">Find out how much loan you can get based on your income.</p>
                  <button 
                    onClick={() => setActiveTab('eligibility')}
                    className="inline-flex items-center gap-2 text-white font-semibold hover:text-orange-200 transition-colors text-sm"
                  >
                    Check Now <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Donut Chart Card */}
            <div className="col-span-12 md:col-span-6 lg:col-span-4 bg-orange-50/30 border border-orange-100 rounded-3xl p-6 shadow-sm">
              <h3 className="font-bold text-blue-900 mb-4">Payment Breakdown</h3>
              
              <div className="h-48 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={70}
                      paddingAngle={3}
                      dataKey="value"
                      stroke="none"
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={index === 0 ? '#1e3a8a' : '#ea580c'} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
                  <div className="text-2xl font-bold text-blue-900">{principalPercentage}%</div>
                  <div className="text-xs text-gray-500">Principal</div>
                </div>
              </div>

              <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-900"></div>
                  <span className="text-sm text-gray-600">Principal ({principalPercentage}%)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-orange-600"></div>
                  <span className="text-sm text-gray-600">Interest ({interestPercentage}%)</span>
                </div>
              </div>
            </div>

            {/* Quick Stats Cards */}
            <div className="col-span-6 md:col-span-3 lg:col-span-2 bg-blue-50/40 border border-blue-100 rounded-3xl p-5 flex flex-col justify-between">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm">
                <PiggyBank className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-900">₹{formatCurrency(loanAmount)}</div>
                <div className="text-sm text-gray-600">Principal</div>
              </div>
            </div>

            <div className="col-span-6 md:col-span-3 lg:col-span-2 bg-orange-50/40 border border-orange-100 rounded-3xl p-5 flex flex-col justify-between">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-900">{interestRate}%</div>
                <div className="text-sm text-gray-600">Interest Rate</div>
              </div>
            </div>

            <div className="col-span-6 md:col-span-6 lg:col-span-2 bg-blue-50/40 border border-blue-100 rounded-3xl p-5 flex flex-col justify-between">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-900">{tenure} {tenureType === 'years' ? 'Yrs' : 'Mo'}</div>
                <div className="text-sm text-gray-600">Tenure</div>
              </div>
            </div>

            <div className="col-span-6 md:col-span-6 lg:col-span-2 bg-orange-50/40 border border-orange-100 rounded-3xl p-5 flex flex-col justify-between">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mb-3 shadow-sm">
                <Target className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-900">₹{formatCurrency(totalInterest)}</div>
                <div className="text-sm text-gray-600">Total Interest</div>
              </div>
            </div>


            {/* Amortization Schedule */}
            <div className="col-span-12 bg-gray-50 border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-blue-900">Repayment Schedule</h3>
                  <p className="text-gray-500 text-sm">Click on a year to view month-wise breakdown</p>
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200 bg-gray-100">
                      <th className="text-left py-4 px-4 text-gray-600 font-semibold text-sm">Year</th>
                      <th className="text-right py-4 px-4 text-gray-600 font-semibold text-sm">Principal Paid</th>
                      <th className="text-right py-4 px-4 text-gray-600 font-semibold text-sm">Interest Paid</th>
                      <th className="text-right py-4 px-4 text-gray-600 font-semibold text-sm">Total EMI</th>
                      <th className="text-right py-4 px-4 text-gray-600 font-semibold text-sm">Balance</th>
                      <th className="text-right py-4 px-4 text-gray-600 font-semibold text-sm">Loan Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {emiCurrentData.map((row, index) => {
                      const originalIndex = emiStartIndex + index;
                      return (
                        <React.Fragment key={originalIndex}>
                          {/* Year Row - Clickable */}
                          <tr 
                            className="border-b border-gray-100 hover:bg-blue-50/50 transition-colors cursor-pointer"
                            onClick={() => toggleYearExpansion(row.year)}
                          >
                            <td className="py-4 px-4">
                              <div className="flex items-center gap-2">
                                <button className="p-1 hover:bg-gray-200 rounded transition-colors">
                                  {expandedYears.includes(row.year) ? (
                                    <Minus className="w-4 h-4 text-gray-500" />
                                  ) : (
                                    <Plus className="w-4 h-4 text-gray-500" />
                                  )}
                                </button>
                                <span className="font-bold text-blue-900">
                                  {row.actualYear}
                                </span>
                              </div>
                            </td>
                            <td className="text-right py-4 px-4 font-medium text-gray-900">₹{formatCurrency(row.principal)}</td>
                            <td className="text-right py-4 px-4 font-medium text-orange-600">₹{formatCurrency(row.interest)}</td>
                            <td className="text-right py-4 px-4 font-medium text-gray-700">₹{formatCurrency(row.totalEmi)}</td>
                            <td className="text-right py-4 px-4 font-bold text-blue-600">₹{formatCurrency(row.balance)}</td>
                            <td className="text-right py-4 px-4 font-medium text-green-600">{row.loanPaidPercent}%</td>
                          </tr>
                          
                          {/* Monthly Breakdown - Shown when expanded */}
                          {expandedYears.includes(row.year) && row.months.map((month: any, monthIndex: number) => (
                            <tr 
                              key={`${originalIndex}-${monthIndex}`} 
                              className="bg-gray-50/80 border-b border-gray-100 hover:bg-gray-100/80 transition-colors"
                            >
                              <td className="py-3 px-4 pl-12">
                                <span className="text-gray-600 text-sm">{month.month}</span>
                              </td>
                              <td className="text-right py-3 px-4 text-sm text-gray-700">₹{formatCurrency(month.principal)}</td>
                              <td className="text-right py-3 px-4 text-sm text-orange-500">₹{formatCurrency(month.interest)}</td>
                              <td className="text-right py-3 px-4 text-sm text-gray-600">₹{formatCurrency(month.emi)}</td>
                              <td className="text-right py-3 px-4 text-sm text-blue-500">₹{formatCurrency(month.balance)}</td>
                              <td className="text-right py-3 px-4 text-sm text-green-500">{month.loanPaidPercent}%</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {emiTotalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="text-sm text-gray-600">
                    Showing {emiStartIndex + 1} to {Math.min(emiEndIndex, amortizationSchedule.length)} of {amortizationSchedule.length} years
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEmiCurrentPage(prev => Math.max(1, prev - 1))}
                      disabled={emiCurrentPage === 1}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        emiCurrentPage === 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      <ChevronLeft className="w-4 h-4" /> Previous
                    </button>
                    
                    <div className="flex items-center gap-1">
                      {Array.from({ length: emiTotalPages }, (_, i) => i + 1).map((page) => {
                        // Show first page, last page, current page, and pages around current
                        if (
                          page === 1 ||
                          page === emiTotalPages ||
                          (page >= emiCurrentPage - 1 && page <= emiCurrentPage + 1)
                        ) {
                          return (
                            <button
                              key={page}
                              onClick={() => setEmiCurrentPage(page)}
                              className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                                emiCurrentPage === page
                                  ? 'bg-blue-900 text-white'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                              }`}
                            >
                              {page}
                            </button>
                          );
                        } else if (
                          page === emiCurrentPage - 2 ||
                          page === emiCurrentPage + 2
                        ) {
                          return (
                            <span key={page} className="px-2 text-gray-400">
                              ...
                            </span>
                          );
                        }
                        return null;
                      })}
                    </div>
                    
                    <button
                      onClick={() => setEmiCurrentPage(prev => Math.min(emiTotalPages, prev + 1))}
                      disabled={emiCurrentPage === emiTotalPages}
                      className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        emiCurrentPage === emiTotalPages
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                      }`}
                    >
                      Next <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <div className="mt-6 flex justify-end">
                <button 
                  onClick={downloadEmiPDF}
                  className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-md"
                >
                  <Download className="w-4 h-4" /> Download Schedule PDF
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Eligibility Calculator View */}
        {activeTab === 'eligibility' && (
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            <div className="col-span-12 lg:col-span-7 bg-blue-50/30 border border-blue-100 rounded-3xl p-6 md:p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                  <CheckCircle2 className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-blue-900">Check Eligibility</h2>
                  <p className="text-gray-500 text-sm">Enter your details to check loan eligibility</p>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Monthly Net Income (₹)</label>
                  <input 
                    type="number" 
                    value={income}
                    onChange={(e) => setIncome(e.target.value)}
                    className="w-full px-4 py-3 text-lg font-semibold text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-2">Salary deposited in bank</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Total Existing EMI (₹)</label>
                  <input 
                    type="number" 
                    value={existingEmi}
                    onChange={(e) => setExistingEmi(e.target.value)}
                    className="w-full px-4 py-3 text-lg font-semibold text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-2">Don't Include Balance transfer loan EMIs</p>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Desired Tenure (Years)</label>
                  <input 
                    type="number" 
                    value={eligTenure}
                    onChange={(e) => setEligTenure(e.target.value)}
                    min="1"
                    max="30"
                    className="w-full px-4 py-3 text-lg font-semibold text-gray-900 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
                    placeholder="1"
                  />
                  <p className="text-xs text-gray-500 mt-2">Repayment period you prefer</p>
                </div>
              </div>
            </div>

            {/* Results Column */}
            <div className="col-span-12 lg:col-span-5">
              <div className="bg-white border-2 border-gray-200 rounded-3xl p-8 shadow-sm">
                <h3 className="text-xl font-bold text-gray-900 mb-6 pb-4 border-b-2 border-green-500">
                  Your Loan Eligibility Result
                </h3>
                
                <div className="space-y-6">
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Max EMI Capacity</div>
                    <div className="text-3xl font-bold text-blue-600">₹{formatCurrency(maxEmiCapacity)}</div>
                    <p className="text-xs text-gray-500 mt-1">This will be new EMI</p>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Per Lakh EMI</div>
                    <div className="text-3xl font-bold text-orange-600">₹{formatCurrency(Math.round((maxEmiCapacity / (eligibleAmount / 100000)) || 0))}</div>
                    <p className="text-xs text-gray-500 mt-1">@ {applicableROI.toFixed(2)}% on {eligTenure || '1'} Years</p>
                  </div>
                  
                  <div>
                    <div className="text-sm text-gray-500 mb-2">Max Loan Amount</div>
                    <div className="text-3xl font-bold text-green-600">₹{formatCurrency(eligibleAmount)}</div>
                    <p className="text-xs text-gray-500 mt-1">Total Eligibility of Loan Amount</p>
                  </div>
                </div>
                
                <Link 
                  href="/apply"
                  className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg mt-8"
                >
                  Apply Now
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Balance Transfer View */}
        {activeTab === 'balance' && (
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            {/* BT Inputs Card */}
            <div className="col-span-12 lg:col-span-6 bg-gradient-to-br from-blue-50 to-orange-50/30 border-2 border-blue-200 rounded-3xl p-6 md:p-8 shadow-lg">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-md">
                  <RefreshCw className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-blue-900">Balance Transfer Details</h2>
                  <p className="text-orange-700 text-sm font-medium">Enter details to check your benefits</p>
                </div>
              </div>

              <div className="space-y-8">
                <SliderInput 
                  label="Monthly Income" 
                  value={btIncome} 
                  setValue={setBtIncome} 
                  min={20000} 
                  max={500000} 
                  step={1000} 
                  prefix="₹"
                  description="Salary deposited in bank"
                />
                <SliderInput 
                  label="BT Loan Amount Outstanding" 
                  value={outstanding} 
                  setValue={setOutstanding} 
                  min={100000} 
                  max={5000000} 
                  step={10000} 
                  prefix="₹"
                  description="Include Balance transfer loan Outstanding"
                />
                <SliderInput 
                  label="Existing EMI" 
                  value={btExistingEmi} 
                  setValue={setBtExistingEmi} 
                  min={0} 
                  max={200000} 
                  step={500} 
                  prefix="₹"
                  description="Don't Include Balance transfer loan EMIs"
                />
                <SliderInput 
                  label="Desired Tenure (Years)" 
                  value={btTenure} 
                  setValue={setBtTenure} 
                  min={1} 
                  max={30} 
                  step={1} 
                  suffix=" Years"
                  description="Max tenure: 7 years"
                />
              </div>
            </div>

            {/* BT Results Grid */}
            <div className="col-span-12 lg:col-span-6 space-y-6">
              
              {/* Top Summary Card */}
              <div className="bg-gradient-to-br from-blue-900 to-blue-800 text-white rounded-3xl p-6 md:p-8 relative overflow-hidden border-2 border-orange-500/20">
                 <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                 <div className="relative">
                   <div className="text-orange-300 text-sm font-bold mb-2">NET IN HAND</div>
                   <div className="text-4xl font-bold mb-1">₹{formatCurrency(btNetInHand)}</div>
                   <p className="text-blue-200 text-sm">Amount available after Balance Transfer</p>
                 </div>
              </div>

              <div className="grid grid-cols-2 gap-4 md:gap-6">
                 {/* Max EMI Capacity */}
                 <div className="bg-blue-50 border-2 border-blue-200 rounded-3xl p-6 shadow-lg hover:shadow-xl hover:border-blue-300 transition-all">
                   <div className="text-sm text-blue-700 font-semibold mb-2">Max EMI Capacity</div>
                   <div className="text-2xl font-bold text-blue-900 mb-1">₹{formatCurrency(btMaxEmi)}</div>
                   <div className="text-xs text-blue-600 font-semibold">New EMI Amount</div>
                 </div>

                 {/* Per Lakh EMI */}
                 <div className="bg-orange-50 border-2 border-orange-200 rounded-3xl p-6 shadow-lg hover:shadow-xl hover:border-orange-300 transition-all">
                   <div className="text-sm text-orange-700 font-semibold mb-2">Per Lakh EMI</div>
                   <div className="text-2xl font-bold text-orange-600 mb-1">₹{formatCurrency(btPerLakhEmi)}</div>
                   <div className="text-xs text-orange-700 font-semibold">@ 10.50% for {btTenure} Years</div>
                 </div>

                 {/* Max Loan Amount */}
                 <div className="bg-gradient-to-br from-blue-900 to-blue-800 border-2 border-orange-500/30 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all col-span-2">
                   <div className="flex justify-between items-end">
                     <div>
                       <div className="text-sm text-orange-300 font-semibold mb-2">Max Loan Eligibility</div>
                       <div className="text-3xl font-bold text-white">₹{formatCurrency(btMaxLoan)}</div>
                       <div className="text-xs text-blue-200 font-semibold mt-1">Total eligible amount based on your income</div>
                     </div>
                     <Link href="/apply" className="bg-gradient-to-r from-orange-600 to-orange-500 text-white p-3 rounded-xl hover:shadow-lg hover:from-orange-700 hover:to-orange-600 transition-all">
                        <ArrowRight className="w-6 h-6" />
                     </Link>
                   </div>
                 </div>
              </div>
            </div>
          </div>
        )}

        {/* Part Payment Calculator View */}
        {activeTab === 'part-payment' && (
          <div className="grid grid-cols-12 gap-4 md:gap-6">
            
            {/* Inputs Column */}
            <div className="col-span-12 lg:col-span-7 space-y-6">
               <div className="bg-blue-50/30 border border-blue-100 rounded-3xl p-6 md:p-8 shadow-sm">
                 <div className="flex items-center gap-3 mb-8">
                   <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm">
                     <PercentIcon className="w-6 h-6 text-blue-600" />
                   </div>
                   <div>
                     <h2 className="text-xl font-bold text-blue-900">Loan Details</h2>
                     <p className="text-gray-500 text-sm">Input your current loan status</p>
                   </div>
                 </div>

                 <div className="space-y-6">
                   <SliderInput 
                     label="Loan Amount (₹)" 
                     value={ppLoanAmount} 
                     setValue={setPpLoanAmount} 
                     min={100000} 
                     max={10000000} 
                     step={10000} 
                     prefix="₹"
                     description="Current outstanding principal amount on your loan"
                   />
                   <SliderInput 
                     label="Interest Rate (%)" 
                     value={ppInterestRate} 
                     setValue={setPpInterestRate} 
                     min={8} 
                     max={21} 
                     step={0.1} 
                     suffix="%"
                     description="Annual interest rate on your existing loan"
                   />
                   <SliderInput 
                     label="Outstanding Tenure (Years)" 
                     value={ppTenure} 
                     setValue={setPpTenure} 
                     min={1} 
                     max={30} 
                     step={1} 
                     suffix=" Years"
                     description="Remaining loan tenure in years"
                   />
                 </div>
               </div>

               {/* Part Payments Inputs */}
               <div className="bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm">
                 <div className="flex justify-between items-center mb-6">
                    <h3 className="font-bold text-gray-900">Part Payments</h3>
                    <button 
                      onClick={addPartPaymentRow}
                      className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-800"
                    >
                      <Plus className="w-4 h-4" /> Add Payment
                    </button>
                 </div>

                 {/* Reduction Type Toggle */}
                 <div className="mb-6">
                   <label className="block text-sm font-semibold text-gray-700 mb-3">Reduce:</label>
                   <div className="flex bg-gray-100 rounded-xl p-1">
                     <button 
                       onClick={() => setPpReductionType('emi')}
                       className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                         ppReductionType === 'emi'
                           ? 'bg-white text-blue-900 shadow-sm'
                           : 'text-gray-500 hover:text-gray-700'
                       }`}
                     >
                       EMI
                     </button>
                     <button 
                       onClick={() => setPpReductionType('tenure')}
                       className={`flex-1 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
                         ppReductionType === 'tenure'
                           ? 'bg-white text-blue-900 shadow-sm'
                           : 'text-gray-500 hover:text-gray-700'
                       }`}
                     >
                       Tenure
                     </button>
                   </div>
                   <p className="text-xs text-gray-500 mt-2">
                     {ppReductionType === 'emi' 
                       ? 'EMI will be reduced while keeping the same tenure'
                       : 'Tenure will be reduced while keeping the same EMI'}
                   </p>
                 </div>

                 <div className="space-y-4">
                   {partPayments.map((payment, index) => (
                     <div key={index} className="flex flex-col sm:flex-row gap-4 items-end sm:items-center bg-gray-50 p-4 rounded-xl">
                       <div className="flex-1 w-full">
                         <label className="block text-xs font-semibold text-gray-500 mb-1">Part Payment {index + 1} (₹)</label>
                         <input 
                           type="number" 
                           value={payment.amount}
                           onChange={(e) => updatePartPayment(index, 'amount', Number(e.target.value))}
                           className="w-full p-2 rounded-lg border border-gray-200 font-bold text-gray-900 focus:outline-none focus:border-blue-500"
                         />
                       </div>
                       <div className="flex-1 w-full">
                         <label className="block text-xs font-semibold text-gray-500 mb-1">at Month</label>
                         <input 
                           type="number" 
                           value={payment.month}
                           onChange={(e) => updatePartPayment(index, 'month', Number(e.target.value))}
                           className="w-full p-2 rounded-lg border border-gray-200 font-bold text-gray-900 focus:outline-none focus:border-blue-500"
                         />
                       </div>
                       {partPayments.length > 1 && (
                         <button 
                           onClick={() => removePartPayment(index)}
                           className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                         >
                           <Trash2 className="w-4 h-4" />
                         </button>
                       )}
                     </div>
                   ))}
                 </div>

                 <button 
                   onClick={calculatePartPayment}
                   className="w-full mt-6 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg"
                 >
                   Calculate Savings
                 </button>
               </div>
            </div>

            {/* Results Column */}
            <div className="col-span-12 lg:col-span-5 space-y-6">
              {/* Summary Card */}
              <div className="bg-blue-900 text-white rounded-3xl p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                
                <div className="relative space-y-8">
                   <div className="grid grid-cols-2 gap-8">
                     <div>
                       <div className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Total Interest With Prepayment</div>
                       <div className="text-xl font-bold">₹{formatCurrency(ppResults.newInterest)}</div>
                     </div>
                     <div>
                       <div className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Interest Without Prepayment</div>
                       <div className="text-xl font-bold">₹{formatCurrency(ppResults.originalInterest)}</div>
                     </div>
                   </div>

                   <div className="bg-amber-100 text-amber-900 p-6 rounded-2xl text-center">
                     <div className="text-sm font-medium mb-1">Your savings on interest is</div>
                     <div className="text-3xl font-bold">₹{formatCurrency(ppResults.savings)}</div>
                   </div>

                   {/* Tenure Reduction Display */}
                   {ppReductionType === 'tenure' && (
                     <div className="bg-green-50 border-2 border-green-200 p-6 rounded-2xl">
                       <div className="text-sm font-semibold text-green-800 mb-2">Tenure Reduction</div>
                       <div className="flex items-center justify-between mb-2">
                         <span className="text-gray-600 text-sm">Original Tenure:</span>
                         <span className="text-gray-900 font-bold">{ppTenure} Years ({ppTenure * 12} months)</span>
                       </div>
                       <div className="flex items-center justify-between">
                         <span className="text-gray-600 text-sm">New Tenure:</span>
                         <span className="text-green-700 font-bold text-lg">
                           {ppResults.newTenureYears} Years {ppResults.newTenureMonths} Months ({ppResults.newTenureYears * 12 + ppResults.newTenureMonths} months)
                         </span>
                       </div>
                       <div className="mt-3 pt-3 border-t border-green-200">
                         <div className="text-xs text-green-700 font-semibold">
                           Tenure Reduced by: {ppTenure * 12 - (ppResults.newTenureYears * 12 + ppResults.newTenureMonths)} months
                         </div>
                       </div>
                     </div>
                   )}

                   {/* EMI Reduction Display */}
                   {ppReductionType === 'emi' && ppResults.schedule.length > 0 && (
                     <div className="bg-blue-50 border-2 border-blue-200 p-6 rounded-2xl">
                       <div className="text-sm font-semibold text-blue-800 mb-2">EMI Reduction</div>
                       <div className="flex items-center justify-between">
                         <span className="text-gray-600 text-sm">Original EMI:</span>
                         <span className="text-gray-900 font-bold">₹{formatCurrency((ppLoanAmount * (ppInterestRate / 12 / 100) * Math.pow(1 + (ppInterestRate / 12 / 100), ppTenure * 12)) / (Math.pow(1 + (ppInterestRate / 12 / 100), ppTenure * 12) - 1))}</span>
                       </div>
                       <div className="flex items-center justify-between mt-2">
                         <span className="text-gray-600 text-sm">Current EMI:</span>
                         <span className="text-blue-700 font-bold text-lg">₹{formatCurrency(ppResults.schedule[ppResults.schedule.length - 1]?.emi || 0)}</span>
                       </div>
                     </div>
                   )}

                   <Link href="/apply" className="block w-full bg-blue-600 text-white text-center font-bold py-3 rounded-xl hover:bg-blue-500 transition-colors">
                     Apply For Loan
                   </Link>
                </div>
              </div>
            </div>

            {/* Schedule Table */}
            {ppResults.schedule.length > 0 && (
              <div className="col-span-12 bg-white border border-gray-200 rounded-3xl p-6 md:p-8 shadow-sm overflow-hidden">
                <h3 className="font-bold text-gray-900 mb-6">Amortization Schedule with Part Payments</h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-blue-900 text-white">
                        <th className="py-3 px-4 text-left rounded-tl-lg">Month</th>
                        <th className="py-3 px-4 text-right">Part Payment (₹)</th>
                        <th className="py-3 px-4 text-right">Remaining Balance (₹)</th>
                        <th className="py-3 px-4 text-right rounded-tr-lg">EMI (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ppCurrentData.map((row, index) => (
                        <tr key={ppStartIndex + index} className="border-b border-gray-100 hover:bg-gray-50">
                          <td className="py-3 px-4 font-medium text-gray-900">{row.month}</td>
                          <td className="py-3 px-4 text-right font-medium text-gray-700">{row.partPayment > 0 ? formatCurrency(row.partPayment) : '0'}</td>
                          <td className="py-3 px-4 text-right text-gray-500">{formatCurrency(row.balance)}</td>
                          <td className="py-3 px-4 text-right font-bold text-blue-600">{formatCurrency(row.emi)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {ppTotalPages > 1 && (
                  <div className="mt-6 flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Showing {ppStartIndex + 1} to {Math.min(ppEndIndex, ppResults.schedule.length)} of {ppResults.schedule.length} months
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPpCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={ppCurrentPage === 1}
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          ppCurrentPage === 1
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        }`}
                      >
                        <ChevronLeft className="w-4 h-4" /> Previous
                      </button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: ppTotalPages }, (_, i) => i + 1).map((page) => {
                          // Show first page, last page, current page, and pages around current
                          if (
                            page === 1 ||
                            page === ppTotalPages ||
                            (page >= ppCurrentPage - 1 && page <= ppCurrentPage + 1)
                          ) {
                            return (
                              <button
                                key={page}
                                onClick={() => setPpCurrentPage(page)}
                                className={`w-8 h-8 rounded-lg text-sm font-semibold transition-colors ${
                                  ppCurrentPage === page
                                    ? 'bg-blue-900 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          } else if (
                            page === ppCurrentPage - 2 ||
                            page === ppCurrentPage + 2
                          ) {
                            return (
                              <span key={page} className="px-2 text-gray-400">
                                ...
                              </span>
                            );
                          }
                          return null;
                        })}
                      </div>
                      
                      <button
                        onClick={() => setPpCurrentPage(prev => Math.min(ppTotalPages, prev + 1))}
                        disabled={ppCurrentPage === ppTotalPages}
                        className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                          ppCurrentPage === ppTotalPages
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-50 text-blue-700 hover:bg-blue-100'
                        }`}
                      >
                        Next <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button 
                    onClick={downloadPartPaymentPDF}
                    className="flex items-center gap-2 bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors shadow-md"
                  >
                    <Download className="w-4 h-4" /> Download Report PDF
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      
      <Footer />
    </main>
  );
};

// Helper Component
const SliderInput = ({ label, value, setValue, min, max, step, prefix = '', suffix = '', description = '' }: any) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [editValue, setEditValue] = React.useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditValue(e.target.value);
  };

  const handleFocus = () => {
    setIsEditing(true);
    setEditValue(value.toString());
  };

  const handleBlur = () => {
    setIsEditing(false);
    const cleanValue = editValue.replace(/,/g, '').replace(/[^0-9.]/g, '');
    const numValue = Number(cleanValue);
    
    if (!isNaN(numValue) && numValue >= min && numValue <= max) {
      setValue(numValue);
    } else if (!isNaN(numValue) && numValue < min) {
      setValue(min);
    } else if (!isNaN(numValue) && numValue > max) {
      setValue(max);
    } else {
      setValue(value); // Keep current value if invalid
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      (e.target as HTMLInputElement).blur();
    }
  };

  const displayValue = isEditing ? editValue : `${prefix}${formatCurrency(value)}${suffix}`;

  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1">
          <label className="flex items-center gap-2 text-gray-700 font-medium mb-1">
            {label}
          </label>
          {description && (
            <p className="text-xs text-gray-500 font-semibold mt-0.5">{description}</p>
          )}
        </div>
        <div className="bg-white px-4 py-2 rounded-xl border-2 border-gray-200 focus-within:border-blue-500 transition-all">
          <input
            type="text"
            value={displayValue}
            onChange={handleInputChange}
            onFocus={handleFocus}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="font-bold text-gray-900 text-right outline-none bg-transparent w-full min-w-[120px]"
          />
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-full appearance-none cursor-pointer accent-blue-600"
      />
    </div>
  );
};

export default function DetailedCalculator() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div></div>}>
      <DetailedCalculatorContent />
    </Suspense>
  );
}
