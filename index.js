var ldap = require('ldapjs');



function LdapSearch(url,bindDN,username,password)
{
  this.base=''
  this.url = url
  this.attributes =[]
  this.client = ldap.createClient({
    url: url,
    bindDN: bindDN,
    reconnect: true

  });
  this.client.bind(username, password, function(err) {
    console.dir(err)
  });

  this.client.on('error', function(err) {
    console.warn('LDAP connection failed, trying to reconnect.', err);
  });
}

LdapSearch.prototype.search = function (searchString, base, attributes,callback) {
  var self = this
  if (typeof(base) == 'function')
    callback = base
  else {
    self.base = base

    if (typeof(attributes) == 'function')
      callback = attributes
    else
      self.attributes = attributes
  }
  names = searchString.split(' ')
  if (names.length > 1)
  {
    l = names.pop()
    f = names.join(' ')
    filter = '(&(givenName='+f+'*)(sn='+l+'*))'
  }
  else
  {
    l = searchString
    f = searchString
    filter = '(|(givenName='+f+'*)(sn='+l+'*))'
  }
  var opts = {
    filter: filter,
    scope: 'sub',
    attributes: self.attributes
  };
  var results=[];
  self.client.search(self.base,opts, function(err, res) {


    res.on('searchEntry', function(entry) {
      results.push(entry.object)
    });
    res.on('searchReference', function(referral) {

    });
    res.on('error', function(err) {
      callback(err,null)
      console.error('error: ' + err.message);
    });
    res.on('end', function(result) {
      callback(null,results)
      console.log('status: ' + result.status);
    });
  });

}

module.exports = LdapSearch;
