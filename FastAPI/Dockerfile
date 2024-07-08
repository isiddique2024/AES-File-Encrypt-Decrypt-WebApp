ARG PYTHON_VERSION=3.11-alpine
FROM python:${PYTHON_VERSION} AS build

WORKDIR /usr/src/app

RUN apk add --no-cache gcc musl-dev

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

FROM python:${PYTHON_VERSION}

WORKDIR /usr/src/app

COPY --from=build /usr/local/lib/python3.11/site-packages /usr/local/lib/python3.11/site-packages
COPY --from=build /usr/local/bin/uvicorn /usr/local/bin/uvicorn

COPY . .

RUN rm -f requirements.txt

EXPOSE 8000

CMD ["uvicorn", "api:server", "--host", "0.0.0.0", "--port", "8000"]