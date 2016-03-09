LdapSearch = require("./index.js")


url = 'ldap://ds.company.com:389/'
bindDN ='DC=company,DC=com'
username = 'company\\ldapuser'
password ='password'
base = 'OU=Employees,OU=Users,DC=company,DC=com'
attributes =['dn', 'givenName','sn', 'cn','telephoneNumber','mobile']


ldapSearch = new LdapSearch(url,bindDN,username,password)

ldapSearch.search("marcello",base,attributes,function(err,results){

    if(!err)
    console.log(JSON.stringify(results,null,2))
    else
    console.log("error")
})
