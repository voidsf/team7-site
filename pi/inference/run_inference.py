def run_inference(image_path):
    from inference_sdk import InferenceHTTPClient

    client = InferenceHTTPClient(
        api_url="https://detect.roboflow.com",
        api_key="JbKtghalWkpDZLFsnKTa"
    )

    result = client.run_workflow(
        workspace_name="compscigroupproject",
        workflow_id="detect-count-and-visualize",
        images={"image": image_path},
        use_cache=True
    )

    return result[0]["predictions"]
