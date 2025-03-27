const passwordHash = "$2b$10$Qh1FeEsNJfEESXe/zTMT5u2Kq5wN7w9/wcv0TvFfkeXGOMD2WJ8nW"; // generated hash for 'password'

export default {
    users: [
        {
            email: "admin@ecosort.com",
            name: "Admin",
            pass: passwordHash
        },
        {
            email: "manager@localbusiness.com",
            name: "Local Business",
            pass: passwordHash
        },
        {
            email: "office@school.com",
            name: "Local School",
            pass: passwordHash
        }
    ],
    devices: [
        {
            device_id: "EcoSort Headquarters",
            user_email: "admin@ecosort.com",
            types: [
                {
                    type_name: "Plastic",
                    count: 50
                },
                {
                    type_name: "Paper",
                    count: 25
                },
                {
                    type_name: "Glass",
                    count: 10
                },
                {
                    type_name: "Non-Recyclable",
                    count: 15
                }
            ]
        },
        {
            device_id: "Bullpen Recycling",
            user_email: "manager@localbusiness.com",
            types: [
                {
                    type_name: "Plastic",
                    count: 20
                },
                {
                    type_name: "Paper",
                    count: 44
                },
                {
                    type_name: "Glass",
                    count: 16
                },
                {
                    type_name: "Non-Recyclable",
                    count: 32
                }
            ]
        },
        {
            device_id: "Year 3 Classroom",
            user_email: "office@school.com",
                        types: [
                {
                    type_name: "Plastic",
                    count: 12
                },
                {
                    type_name: "Paper",
                    count: 60
                },
                {
                    type_name: "Glass",
                    count: 6
                },
                {
                    type_name: "Non-Recyclable",
                    count: 40
                }
            ]
        },
        {
            device_id: "Year 4 Classroom",
            user_email: "office@school.com",
                        types: [
                {
                    type_name: "Plastic",
                    count: 15
                },
                {
                    type_name: "Paper",
                    count: 50
                },
                {
                    type_name: "Glass",
                    count: 20
                },
                {
                    type_name: "Metal",
                    count: 5
                },
                {
                    type_name: "Non-Recyclable",
                    count: 35
                }
            ]
        }
    ],
};