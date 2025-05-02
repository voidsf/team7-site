from inference_sdk import InferenceHTTPClient

client = InferenceHTTPClient(
    api_url="https://detect.roboflow.com",
    api_key="JbKtghalWkpDZLFsnKTa"
)

result = client.run_workflow(
    workspace_name="compscigroupproject",
    workflow_id="detect-count-and-visualize",
    images={
        "image": "image2.jpg"
    },
    use_cache=True # cache workflow definition for 15 minutes
)
print(result[0]["predictions"])
