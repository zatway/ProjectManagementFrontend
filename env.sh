#!/bin/bash

find "/usr/share/nginx/html" -type f -exec sed -i 's|'"PROD_ENV_VITE_SERVICES_HOST"'|'"$PROD_ENV_VITE_SERVICES_HOST"'|g' {} \;
find "/usr/share/nginx/html" -type f -exec sed -i 's|'"PROD_ENV_VITE_IDENTITY_HOST"'|'"$PROD_ENV_VITE_IDENTITY_HOST"'|g' {} \;