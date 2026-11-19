from uuid import UUID
from typing import Any

data: dict[UUID, Any] = {
    UUID("2e5ab28a-4ddf-48a1-ad0a-ace98ef64832"): {
        "projects": {
            UUID("54ea8459-d43e-407d-a6c6-b8b9ad3f7c59"): {
                "id": UUID("54ea8459-d43e-407d-a6c6-b8b9ad3f7c59"),
                "name": "project_name",
                "description": "project_description",
                "environments": {
                    UUID("e4f83f05-14d4-48a8-81a9-dff1196c24c8"): {
                        "id": UUID("e4f83f05-14d4-48a8-81a9-dff1196c24c8"),
                        "name": "environment_name",
                        "description": "environment_description",
                        "monitors": {
                            UUID("2948bd56-5d47-4c3a-8b8b-436199ade864"): {
                                "id": UUID("2948bd56-5d47-4c3a-8b8b-436199ade864"),
                                "name": "updated_name",
                                "description": "updated_description",
                                "tag": "dummy_tag",
                                "url": "http://dummy.url"
                            },
                            UUID("93e5c293-9748-455e-9911-d1f72ccde2a3"): {
                                "id": UUID("93e5c293-9748-455e-9911-d1f72ccde2a3"),
                                "name": "monitor_name",
                                "description": "monitor_description",
                                "tag": "dummy_tag",
                                "url": "http://dummy.url"
                            },
                            UUID("a2a26000-f299-4f75-bb30-fd9dbe5a5c4c"): {
                                "id": UUID("a2a26000-f299-4f75-bb30-fd9dbe5a5c4c"),
                                "name": "monitor_name",
                                "description": "monitor_description",
                                "tag": "dummy_tag",
                                "url": "http://dummy.url"
                            }
                        }
                    },
                    UUID("bb64e669-26c4-4167-9794-0433c976c998"): {
                        "id": UUID("bb64e669-26c4-4167-9794-0433c976c998"),
                        "name": "environment_name",
                        "description": "environment_description"
                    },
                    UUID("b839760c-607c-4e0f-9348-4420ef2b58e2"): {
                        "id": UUID("b839760c-607c-4e0f-9348-4420ef2b58e2"),
                        "name": "environment_name",
                        "description": "environment_description"
                    },
                    UUID("59d0a4f2-7c6c-48d2-ba53-4739fc94671d"): {
                        "id": UUID("59d0a4f2-7c6c-48d2-ba53-4739fc94671d"),
                        "name": "environment_name",
                        "description": "environment_description"
                    }
                }
            },
            UUID("79c67f8f-66f5-4ffd-86a9-594f10006b3a"): {
                "id": UUID("79c67f8f-66f5-4ffd-86a9-594f10006b3a"),
                "name": "project_name",
                "description": "project_description",
                "environments": {
                    UUID("1174b78a-40b5-4d5b-85da-38607ec315ed"): {
                        "id": UUID("1174b78a-40b5-4d5b-85da-38607ec315ed"),
                        "name": "environment_name",
                        "description": "environment_description"
                    },
                    UUID("b9c5b66f-cf78-4ab0-836b-a97de525208e"): {
                        "id": UUID("b9c5b66f-cf78-4ab0-836b-a97de525208e"),
                        "name": "environment_name",
                        "description": "environment_description"
                    },
                    UUID("8138b1bb-c431-44a0-979c-8918fcb03fe7"): {
                        "id": UUID("8138b1bb-c431-44a0-979c-8918fcb03fe7"),
                        "name": "environment_name",
                        "description": "environment_description"
                    },
                    UUID("81986acb-b109-4583-9017-10768c349092"): {
                        "id": UUID("81986acb-b109-4583-9017-10768c349092"),
                        "name": "environment_name",
                        "description": "environment_description"
                    }
                }
            },
            UUID("5b336faa-ec0e-4ebe-bc9d-99c3acc5f4ec"): {
                "id": UUID("5b336faa-ec0e-4ebe-bc9d-99c3acc5f4ec"),
                "name": "project_name",
                "description": "project_description"
            },
            UUID("2344ca7a-6ac2-4e72-abd9-cbef5e0c5c68"): {
                "id": UUID("2344ca7a-6ac2-4e72-abd9-cbef5e0c5c68"),
                "name": "project_name",
                "description": "project_description"
            },
            UUID("10b7794f-42af-464f-a836-33082997f60a"): {
                "id": UUID("10b7794f-42af-464f-a836-33082997f60a"),
                "name": "project_name",
                "description": "project_description"
            },
            UUID("aaa64970-e093-4679-a1cd-ea9580e72cbe"): {
                "id": UUID("aaa64970-e093-4679-a1cd-ea9580e72cbe"),
                "name": "project_name",
                "description": "project_description"
            },
            UUID("c937c929-fc99-4c04-8b75-1370671e72a5"): {
                "id": UUID("c937c929-fc99-4c04-8b75-1370671e72a5"),
                "name": "project_name",
                "description": "project_description"
            },
            UUID("6918e359-518b-488a-b942-5e33296b9d76"): {
                "id": UUID("6918e359-518b-488a-b942-5e33296b9d76"),
                "name": "project_name",
                "description": "project_description"
            }
        }
    }
}