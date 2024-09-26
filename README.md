# UML Class Diagram Editor 

My degree thesis work

## Running the program

Creating the docker image:

```bash
docker buildx build . -t class-diagram-editor:latest
```

Running the container:

```bash 
docker run --rm -p 80:80 class-diagram-editor
```

Then the site will be accessible at [localhost:80](http://localhost:80)
