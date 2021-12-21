from sqlalchemy import inspect


def sa_orm_object_as_dict(obj, drop_keys=None):
    """
    Turns an instance of an SQLAlchemy ORM model object into
    a dict a key-value pair per column/field in the model instance.
    It uses SQLAlchemys `inspect` API to get the column names from the models
    mapper metadata and then iterates over them to create the dict.

    Borrowed with gratitude from https://stackoverflow.com/a/37350445
    """
    if drop_keys is None:
        drop_keys = []

    return {
        column_attrs.key: getattr(obj, column_attrs.key)
        for column_attrs in inspect(obj).mapper.column_attrs
        if column_attrs.key not in drop_keys
    }
