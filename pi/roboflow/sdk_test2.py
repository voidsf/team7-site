from inference_sdk import InferenceHTTPClient

client = InferenceHTTPClient(
    api_url="http://localhost:9001", # use local inference server
    api_key="JbKtghalWkpDZLFsnKTa"
)

result = client.run_workflow(
    workspace_name="compscigroupproject",
    workflow_id="detect-count-and-visualize",
    images={
        "image": "YOUR_IMAGE.jpg"
    }
)
