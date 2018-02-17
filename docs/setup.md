# Setup

## Legacy MongoDB
For systems using older versions (pre 2.6) of **MongoDB**, the default `node_modules` won't work correctly. To fix this, run the script `npm run legacy-modules`, and this will copy some older modules into the project's `node_modules` directory. As `node_modules` is excluded from *git*, this shouldn't affect the project itself. Please note that there may be some issues caused by version mismatches.

Remember to run the script (if you have an older version of **MongoDB**) each time that you've run `npm install`.

The modules that are used:
* mongodb
* mongodb-core
* mongoose
* aysnch
* asynch-each
* asynch-foreach
* hooks-fixed
* mpromise
* muri
