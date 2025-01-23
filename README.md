# UML Class Diagram Editor

UCDE is an online class diagram editor. It can be viewed at [szodavid.github.io/uml-class-diagram-editor](https://szodavid.github.io/uml-class-diagram-editor/).

For more information visit the [wiki](https://github.com/SzoDavid/uml-class-diagram-editor/wiki)!

## Running the program locally

### In development, using node

Install dependencies.

```bash
npm ci
```

Run the dev server

```bash
npm run dev
```

### Using docker 

Creating the docker image:

```bash
docker buildx build . -t class-diagram-editor:latest
```

Running the container:

```bash 
docker run --rm -p 80:80 class-diagram-editor
```

Then the site will be accessible at [localhost:80](http://localhost:80)

## References

[uml-diagrams.org Authored by Kirill Fakhroutdinov](https://www.uml-diagrams.org/class-diagrams-overview.html)  
[UML 2.5.1 specifications](https://www.omg.org/spec/UML/2.5.1/PDF)
