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

## TODOs

- separate staticString logic
- display validation errors
- in classes add grouping attributes and operations by visibility
- class stereotypes
- grid size when moving
- property modifiers
- oper-property
- tests
- option to show that there are other, not shown features in class
- show abstract with keyword
- if operation has many properties, display it in multiple columnsF