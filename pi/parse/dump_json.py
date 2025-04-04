def dump_json(data, filepath):
    import json

    with open(filepath, 'w') as json_file:
        json.dump(data, json_file, indent=4)
