const config = {};

config.API_BASE_URI = "";
config.companyFile = 'C:\\Users\\admin\\Desktop\\QBD Materials\\Sample QB Files\\GoldMiner.QBW';
config.wsdl_path = "C:\\Users\\admin\\Desktop\\QBD Materials\\QuickBooksIntegrator\\lib\\qbws.wsdl";
config.verbosity = 2;
config.username = "Admin";
config.password = "Password#1984";
config.port = 8000;
config.soap_path = '/wsdl';

config.version_QBXML = '1.0';
config.version_QBXML_instructuction = 'version="4.0"';

config.qbws = {
    QBWebConnectorSvc: {
        QBWebConnectorSvcSoap: {}
    }
};

// Environment Variables
config.development = {
    "loggerid": "Development"
};

config.production = {
    "loggerid": "Production"
};

config.testing = {
    "loggerid": "Testing"
};

module.exports = config;