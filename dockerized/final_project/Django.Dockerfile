FROM python:3.8-slim-buster

WORKDIR /final_project

COPY . .

RUN pip install --trusted-host pypi.python.org -r requirements.txt

EXPOSE 8000

CMD ["python", "manage.py", "test"]
