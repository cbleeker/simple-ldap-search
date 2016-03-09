# A simple library to search for a user in an LDAP directory.

Example:

```javascript
ldapurl = 'ldap://ds.company.com:389/'
bindDN ='DC=company,DC=com'
username = 'company\\ldapuser'
password ='password'
base = 'OU=Employees,OU=Users,DC=company,DC=com'
returned_attributes =['dn', 'givenName','sn', 'cn','telephoneNumber','mobile']

ldapSearch = new LdapSearch(ldapurl,bindDN,username,password)

ldapSearch.search("marcello",base,returned_attributes,function(err,results){

    if(!err)
    console.log(JSON.stringify(results,null,2))
    else
    console.log("error")
})
```