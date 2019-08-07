Prepare xml for CDMBuilder based on json  through POST service

In order to RUN API

1. REBUILD, FROM PATH WHERE setup.py LOCATED
```
$ python setup.py install
```
2. Check path to the configuration/default.json
3. Check rest_api.py for existance:
```python
if __name__ == '__main__':
    app.run(host='0.0.0.0')
```
AND RUN SIPMLE FROM PATH WHERE rest_api.py LOCATED
> pythom rest_api.py

OR
```python
if __name__ == '__main__':
    app.run()
```
AND RUN VIA CMD/BASH FROM PATH WHERE rest_api.py LOCATED
```
$ export/set FLASK_APP=hello.py
$ flask run --host=0.0.0.0
```
	
