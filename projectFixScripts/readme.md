### Project Fix Scripts
While Hedron is in beta, it is too much work to have backwards compatibility inside the app. However it can be annoying when you've spent a long time on a project and it doesn't work in a new version because of some tiny change in the JSON structure of the project files. So here we have a very quick and dirty attempt at fixing issues between versions. These scripts are not guaranteed to fix your project, but might do! Otherwise they can be seen as a great starting point in getting your project file fixed.

If you do make any changes to these scripts that you feel might be useful to other users, please make a pull request. :)

## How to use the scripts
Place your broken project file in the "input" folder, navigate to this directory in the terminal, and run:

```bash
node ./0.5-0.6 ./input/yourproject.json
```

A new version of your project file will be generated in the "output" folder.
