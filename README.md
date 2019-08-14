Prepare xml for CDMBuilder based on json  through POST service

In order to RUN API

1. Rebuild, from path where setup.py located
```
$ python setup.py install
```
2. Check path to the configuration/default.json
3. Check rest_api.py for existance:
```python
if __name__ == '__main__':
    app.run(host='0.0.0.0')
```
and run simple where rest_api.py located
> pythom rest_api.py

or
```python
if __name__ == '__main__':
    app.run()
```
and run via CMD/BASH from path where rest_api.py located
```
$ export/set FLASK_APP=hello.py
$ flask run --host=0.0.0.0 --port=5000
```
	
