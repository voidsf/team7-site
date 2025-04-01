def FindType(result):
	max_confidence = 0
	device_id = 'Year 3 Classroom'
	predictions = result[0][predictions][predictions]
# if there is a multiple items detected it finds the one with the most confidence
	if predictions:
		for i in predictions:
			if i['confidence'] > max_confidence:
				max_confidence = i['confidence']
				item = predictions(i)
		if max_confidence > 0.5:
			output_type = item['class']	
		else:
			output_type = 'Non-Recyclable'
	else: 
# if there is no output detected it is non-recyclable
		output_type = 'Non-Recyclable'
	update(device_id,output_type)



