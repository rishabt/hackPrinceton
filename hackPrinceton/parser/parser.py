import sys
import xml.dom.minidom
import urllib2

file = urllib2.urlopen('http://access.alchemyapi.com/calls/url/URLGetText?apikey=bfded286f68a02617b0ad722050a135cec5a65c1&url=' + str(sys.argv[1]))

data = file.read()

file.close()

dom = xml.dom.minidom.parseString(data)

record = dom.getElementsByTagName('text')
node = record[0]

result = node.childNodes[0]

text = result.nodeValue.encode('ascii', 'ignore')

print text

