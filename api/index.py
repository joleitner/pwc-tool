from typing import Union

from fastapi import FastAPI

app = FastAPI(docs_url="/api/docs",  redoc_url="/api/redoc", openapi_url="/api/openapi.json")


@app.get("/api")
async def read_root():
    return {"Hello": "World"}


@app.get("/api/items/{item_id}")
async def read_item(item_id: int, q: Union[str, None] = None):
    return {"item_id": item_id, "q": q}