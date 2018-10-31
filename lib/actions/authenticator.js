'use strict';
const messages = require('elasticio-node').messages;
const uuid = require('node-uuid');
const xmlbuilder = require('xmlbuilder');

exports.process = processAction;

async function processAction(msg, cfg) {

    /* var soapaction = msg.body.soapaction.clientVersion;
    console.log("Soap Action :  " + soapaction);
    const action = soapaction.substring(soapaction.lastIndexOf("/") + 1, soapaction.length - 1);
    var response;
    console.log("Action Method : " + action); */

    console.log("Action Response : ");
    console.log(JSON.stringify(msg, null, "\t"))

    const self = this;

    var response;

    /* Processing Client Version method call */
    if (msg.body["soap-Envelope"]["soap-Body"].clientVersion) {
        // var value = msg.body["soap-Envelope"]["soap-Body"]["clientVersion"]["strVersion"]["_"]; // desktop installed software dependent 
        var value = 'O:' + msg.body["soap-Envelope"]["soap-Body"].clientVersion.strVersion

        response = "<ns1:clientVersionResponse><ns1:clientVersionResult><ns1:string>" + value + "</ns1:string></ns1:clientVersionResult></ns1:clientVersionResponse>";
    }
    /* Processing Server Version method call */
    else if (msg.body["soap-Envelope"]["soap-Body"].serverVersion) {
        value = "0.2.1" // hardcoded

        response = "<ns1:serverVersionResponse><ns1:serverVersionResult><ns1:string>" + value + "</ns1:string></ns1:serverVersionResult></ns1:authenticateResponse>";
    }
    /* Processing Authenticate method call */
    else if (msg.body["soap-Envelope"]["soap-Body"].authenticate) {
        var username = msg.body["soap-Envelope"]["soap-Body"].authenticate.strUserName;
        var password = msg.body["soap-Envelope"]["soap-Body"].authenticate.strPassword;

        console.log("Authenticating ... UserName : " + username + ", Password : " + password);

        // User Authenticated 
        if (true) { //username === 'Admin' && password === 'Password#1984') {
            //var strRequestXML, inputXMLDoc;
            var token_authenticate = uuid.v1(); // Ticket Token after successful authentication
            console.log("Token : " + token_authenticate);

            /* response = builder.create('SOAP-ENV:Envelope', { encoding: 'utf-8' })
                .att('xmlns:SOAP-ENV', "http://schemas.xmlsoap.org/soap/envelope/")
                .att('xmlns:ns1', "http://developer.intuit.com/")

                .ele('SOAP-ENV:Body')
                .ele('ns1:authenticateResponse')
                .ele('ns1:authenticateResult')
                .ele('ns1:string').text(token_authenticate).up()
                .ele('ns1:string').text(''); // empty value refers to the currently opened company file.. 

            response = response.end({ 'pretty': true }); */

            response = "<ns1:authenticateResponse>\n<ns1:authenticateResult>\n<ns1:string>" + token_authenticate + "</ns1:string>\n<ns1:string></ns1:string>\n</ns1:authenticateResult>\n</ns1:authenticateResponse>";
        }
        else {
            response = "<ns1:authenticateResponse>\n<ns1:authenticateResult>\n<ns1:string></ns1:string>\n<ns1:string>nvu</ns1:string>\n</ns1:authenticateResult>\n</ns1:authenticateResponse>";
        }
    }
    else if (msg.body["soap-Envelope"]["soap-Body"].sendRequestXML) {

        var subbody = msg.body["soap-Envelope"]["soap-Body"].sendRequestXML;

        var ticket = subbody.ticket;
        var strHCPResponse = subbody.strHCPResponse; // This would be empty in every subsequent requests until the connection is closed
        var strCompanyFileName = subbody.strCompanyFileName;
        var qbXMLCountry = subbody.qbXMLCountry;
        var qbXMLMajorVers = subbody.qbXMLMajorVers;
        var qbXMLMinorVers = subbody.qbXMLMinorVers;

        console.log("Ticket ID received : " + ticket)

        // Submitting Vendor Query Request.. 
        /* response = builder.create('QBXML', { version: '1.0' })
            .instruction('qbxml', 'version="4.0"')
            .ele('QBXMLMsgsRq', { 'onError': 'stopOnError' })
            .ele('VendorQueryRq', { 'requestID': '0' }) // Vendor Query Request... 
            .ele('MaxReturned').text('1')
            .end({ 'pretty': true }); */

        response = "<sendRequestXML xmlns=\"http://developer.intuit.com/\">"
        +" <ticket>a05fd1b411f6e22adbb5717f96876b5b</ticket>"
        +"<strHCPResponse><?xml version=\"1.0\" ?>"
        +"<QBXML>"
        +"<QBXMLMsgsRs>"
        +"<HostQueryRs requestID=\"0\" statusCode=\"0\" statusSeverity=\Info\" statusMessage=\"Status OK\">"
        +"<HostRet>"
        +"<ProductName>\"QuickBooks Pro 2006\"</ProductName>"
        +"<MajorVersion>\"16\"</MajorVersion>"
        +"<MinorVersion>\"0\"</MinorVersion>"
        +"<Country>\"US\"</Country>"
        +"<SupportedQBXMLVersion>\"1.0\"</SupportedQBXMLVersion>"
        +"<SupportedQBXMLVersion>\"1.1\"</SupportedQBXMLVersion>"
        +"<SupportedQBXMLVersion>\"2.0\"</SupportedQBXMLVersion>"
        +"<SupportedQBXMLVersion>\"2.1\"</SupportedQBXMLVersion>"
        +"<SupportedQBXMLVersion>\"3.0\"</SupportedQBXMLVersion>"
        +"<SupportedQBXMLVersion>\"4.0\"</SupportedQBXMLVersion>"
        +"<SupportedQBXMLVersion>\"4.1\"</SupportedQBXMLVersion>"
        +"<SupportedQBXMLVersion>\"5.0\"</SupportedQBXMLVersion>"
        +"<IsAutomaticLogin>\"false\"</IsAutomaticLogin>"
        +"<QBFileMode>\"SingleUser\"</QBFileMode>"
        +"</HostRet>"
        +"</HostQueryRs>"
        +"<CompanyQueryRs requestID=\"1\" statusCode=\"0\" statusSeverity=\"Info\" statusMessage=\"Status OK\">"
        +"<CompanyRet>"
        +"<IsSampleCompany>\"false\"</IsSampleCompany>"
        +"<CompanyName>\"Test Company 2\"</CompanyName>"
        +"<LegalCompanyName>\"Test Company 2\"</LegalCompanyName>"
        +"<FirstMonthFiscalYear>\"January\"</FirstMonthFiscalYear>"
        +"<FirstMonthIncomeTaxYear>\"January\"</FirstMonthIncomeTaxYear>"
        +"<CompanyType>\"General Business\"</CompanyType>"
        +"<TaxForm>\"OtherOrNone\"</TaxForm>"
        +"<DataExtRet>"
        +"<DataExtName>\"AppLock\"</DataExtName>"
        +"<DataExtType>\"STR255TYPE\"</DataExtType>"
        +"<DataExtValue>\"LOCKED:MACBOOK-WINDOWS:633772023577302500+\"</DataExtValue>"
        +"</DataExtRet>"
        +"<DataExtRet>"
        +"<DataExtName>\"FileID\"</DataExtName>"
        +"<DataExtType>\"STR255TYPE\"</DataExtType>"
        +"</DataExtRet>"
        +"</CompanyRet>"
        +"</CompanyQueryRs>"
        +"<PreferencesQueryRs requestID=\"2\" statusCode=\"0\" statusSeverity=\"Info\" statusMessage=\"Status OK\">"
        +"<PreferencesRet>"
        +"<AccountingPreferences>"
        +"<IsUsingAccountNumbers>\"false\"</IsUsingAccountNumbers>"
        +"<IsRequiringAccounts>\"true\"</IsRequiringAccounts>"
        +"<IsUsingClassTracking>\"false\"</IsUsingClassTracking>"
        +"<IsUsingAuditTrail>\"true\"</IsUsingAuditTrail>"
        +"<IsAssigningJournalEntryNumbers>\"true\"</IsAssigningJournalEntryNumbers>"
        +"</AccountingPreferences>"
        +"<FinanceChargePreferences>"
        +"<AnnualInterestRate>\"0.00\"</AnnualInterestRate>"
        +"<MinFinanceCharge>\"0.00\"</MinFinanceCharge>"
        +"<GracePeriod>\"0\"</GracePeriod>"
        +"<IsAssessingForOverdueCharges>\"false\"</IsAssessingForOverdueCharges>"
        +"<CalculateChargesFrom>\"DueDate\"</CalculateChargesFrom>"
        +"<IsMarkedToBePrinted>\"false\"</IsMarkedToBePrinted>"
        +"</FinanceChargePreferences>"
        +"<JobsAndEstimatesPreferences>"
        +"<IsUsingEstimates>\"true\"</IsUsingEstimates>"
        +"<IsUsingProgressInvoicing>\"false\"</IsUsingProgressInvoicing>"
        +"<IsPrintingItemsWithZeroAmounts>\"false\"</IsPrintingItemsWithZeroAmounts>"
        +"</JobsAndEstimatesPreferences>"
        +"<PurchasesAndVendorsPreferences>"
        +"<IsUsingInventory>\"true\"</IsUsingInventory>"
        +"<DaysBillsAreDue>\"10\"</DaysBillsAreDue>"
        +"<IsAutomaticallyUsingDiscounts>\"false\"</IsAutomaticallyUsingDiscounts>"
        +"</PurchasesAndVendorsPreferences>"
        +"<ReportsPreferences>"
        +"<AgingReportBasis>\"AgeFromDueDate\"</AgingReportBasis>"
        +"<SummaryReportBasis>\"Accrual\"</SummaryReportBasis>"
        +"</ReportsPreferences>"
        +"<SalesAndCustomersPreferences>"
        +"<IsTrackingReimbursedExpensesAsIncome>\"false\"</IsTrackingReimbursedExpensesAsIncome>"
        +"<IsAutoApplyingPayments>\"true\"</IsAutoApplyingPayments>"
        +"<PriceLevels>"
        +"<IsUsingPriceLevels>\"true\"</IsUsingPriceLevels>"
        +"<IsRoundingSalesPriceUp>\"true\"</IsRoundingSalesPriceUp>"
        +"</PriceLevels>"
        +"</SalesAndCustomersPreferences>"
        +"<TimeTrackingPreferences>"
        +"<FirstDayOfWeek>\"Monday\"</FirstDayOfWeek>"
        +"</TimeTrackingPreferences>"
        +"<CurrentAppAccessRights>"
        +"<IsAutomaticLoginAllowed>\"false\"</IsAutomaticLoginAllowed>"
        +"<IsPersonalDataAccessAllowed>\"false\"</IsPersonalDataAccessAllowed>"
        +"</CurrentAppAccessRights>"
        +"</PreferencesRet>"
        +"</PreferencesQueryRs>"
        +"</QBXMLMsgsRs>"
        +"</QBXML>"
         +"</strHCPResponse>"
        +"<strCompanyFileName>C:\\Users\\admin\\Desktop\\QBD Materials\\Sample QB Files\\GoldMiner.QBW</strCompanyFileName>"
         +"<qbXMLCountry>US</qbXMLCountry>"
        +"<qbXMLMajorVers>5</qbXMLMajorVers>"
         +"<qbXMLMinorVers>0</qbXMLMinorVers>"
     +"</sendRequestXML>"
    }
    else if (msg.body["soap:Envelope "]["soap-Body"].sendRequestXMLResponse) {
        response = "<ns1:sendRequestXMLResponse>"
        +"<ns1:sendRequestXMLResult><?xml version=\"1.0\" ?>"
        +"<?qbxml version=&quot;2.1&quot;?>"
        +"<QBXML>"
            +"<QBXMLMsgsRq onError=&quot;stopOnError&quot;>"
                +"<ReceivePaymentAddRq requestID=&quot;UmVjZWl2ZVBheW1lbnRBZGR8MTE2&quot;>"
                    +"<ReceivePaymentAdd>"
                        +"<CustomerRef>"
                            +"<ListID>\"90000-1241602188\"</ListID>"
                        +"</CustomerRef>"
                        +"<TxnDate>\"2009-05-06\"</TxnDate>"
                        +"<RefNumber>\"116\"</RefNumber>"
                        +"<TotalAmount>\"265.40\"</TotalAmount>"
                        +"<Memo>\"Payment for invoice #116\"</Memo>"
                        +"<IsAutoApply>\"true\"</IsAutoApply>"
                    +"</ReceivePaymentAdd>"
                +"</ReceivePaymentAddRq>"
            +"</QBXMLMsgsRq>"
        +"</QBXML>"
        +"</ns1:sendRequestXMLResult>"
    +"</ns1:sendRequestXMLResponse>"
    }
    else if (msg.body["soap:Envelope "]["soap-Body"].receiveResponseXML ) {
        response = "<receiveResponseXML xmlns=\"http://developer.intuit.com/\">"
        +"<ticket>a05fd1b411f6e22adbb5717f96876b5b</ticket>"
      +"<response><?xml version=\"1.0\" ?>"
+"<QBXML>"
+"<QBXMLMsgsRs>"
+"<ReceivePaymentAddRs requestID=\"UmVjZWl2ZVBheW1lbnRBZGR8MTE2\" statusCode=\"0\" statusSeverity=\"Info\" statusMessage=\"Status OK\">"
+"<ReceivePaymentRet>"
+"<TxnID>\"1F6-1241605561\"</TxnID>"
+"<TimeCreated>\"2009-05-06T06:26:01-05:00\"</TimeCreated>"
+"<TimeModified>\"2009-05-06T06:26:01-05:00\"</TimeModified>"
+"<EditSequence>\"1241605561\"</EditSequence>"
+"<TxnNumber>\"139\"</TxnNumber>"
+"<CustomerRef>"
+"<ListID>\"90000-1241602188\"</ListID>"
+"<FullName>\"Test Company\"</FullName>"
+"</CustomerRef>"
+"<ARAccountRef>"
+"<ListID>\"260000-1226546874\"</ListID>"
+"<FullName>\"Accounts Receivable\"</FullName>"
+"</ARAccountRef>"
+"<TxnDate>\"2009-05-06\"</TxnDate>"
+"<RefNumber>\"116\"</RefNumber>"
+"<TotalAmount>\"265.40\"</TotalAmount>"
+"<Memo>\"Payment for invoice #116\"</Memo>"
+"<DepositToAccountRef>"
+"<ListID>\"270000-1226599344\"</ListID>"
+"<FullName>\"Undeposited Funds\"</FullName>"
+"</DepositToAccountRef>"
+"<UnusedPayment>\"0.00\"</UnusedPayment>"
+"<UnusedCredits>\"0.00\"</UnusedCredits>"
+"<AppliedToTxnRet>"
+"<TxnID>\"1EB-1241602355\"</TxnID>"
+"<TxnType>\"Invoice\"</TxnType>"
+"<TxnDate>\"2008-05-31\"</TxnDate>"
+"<RefNumber>\"115\"</RefNumber>"
+"<BalanceRemaining>\"0.00\"</BalanceRemaining>"
+"<Amount>\"100.00\"</Amount>"
+"</AppliedToTxnRet>"
+"<AppliedToTxnRet>"
+"<TxnID>\"1EE-1241602356\"</TxnID>"
+"<TxnType>\"Invoice\"</TxnType>"
+"<TxnDate>\"2008-10-02\"</TxnDate>"
+"<RefNumber>\"116\"</RefNumber>"
+"<BalanceRemaining>\"20.00\"</BalanceRemaining>"
+"<Amount>\"165.40\"</Amount>"
+"</AppliedToTxnRet>"
+"</ReceivePaymentRet>"
+"</ReceivePaymentAddRs>"
+"</QBXMLMsgsRs>"
+"</QBXML>"
+"</response>"
   +"<hresult />"
    +"<message />"
+"</receiveResponseXML>"
    }
    else if (msg.body["soap:Envelope "]["soap-Body"].receiveResponseXMLResponse) {
        response = "<ns1:receiveResponseXMLResponse>"
        +"<ns1:receiveResponseXMLResult>100</ns1:receiveResponseXMLResult>"
    +"</ns1:receiveResponseXMLResponse>"
    }

    else if (msg.body["soap-Envelope"]["soap-Body"].connectionError) {
        response = "connectionError"
    }

    else if (msg.body["soap-Envelope"]["soap-Body"].getLastError) {
        response = "Last error is to be received here.. "

    }
    else if (msg.body["soap-Envelope"]["soap-Body"].closeConnection) {
        response = "<ns1:closeConnectionResponse><ns1:closeConnectionResult>Complete!</ns1:closeConnectionResult></ns1:closeConnectionResponse>"
    }

    console.log("Body Generated : " + JSON.stringify(response));

    /* return co(function* gen() {
        console.log("Acting on Response : \n" + response);
        var result = messages.newMessageWithBody(response);
        console.log("Result : \n" + JSON.stringify(result, null, "\t"));
        return result;
    }); */

    self.emit('data', messages.newMessageWithBody({ "response": response }));
}