from typing import Any
from uuid import UUID

database: dict[UUID, Any] = {
    UUID("2e5ab28a-4ddf-48a1-ad0a-ace98ef64832"): {
        "projects": {
            UUID("bd9d7c59-2b12-4fd3-a924-09a539db9088"): {
                "id": UUID("bd9d7c59-2b12-4fd3-a924-09a539db9088"),
                "name": "Scrappy RAG",
                "description": "This is a project for the Scrappy RAG application. Used to analyze documents using AI.",
                "environments": {
                    UUID("14b79c61-69ac-4d7b-8d20-8418c5efca09"): {
                        "id": UUID("14b79c61-69ac-4d7b-8d20-8418c5efca09"),
                        "name": "Productions",
                        "description": "environment_description",
                        "monitors": {
                            UUID("c108f550-64a9-4030-b01d-a5f6d3a73849"): {
                                "id": UUID("c108f550-64a9-4030-b01d-a5f6d3a73849"),
                                "name": "Frontend",
                                "description": "updated_description",
                                "tag": "scrappy",
                                "url": "https://scrappy.johnmgrubbs.io"
                            },
                            UUID("d0919d16-8113-4dc0-a758-642f48cb988a"): {
                                "id": UUID("d0919d16-8113-4dc0-a758-642f48cb988a"),
                                "name": "Minio",
                                "description": "S3 compatible object storage server",
                                "tag": "minio",
                                "url": "https://minio.johnmgrubbs.io"
                            },
                            UUID("ccb5594d-0bc9-48d2-a6b9-193562eb1ce9"): {
                                "id": UUID("ccb5594d-0bc9-48d2-a6b9-193562eb1ce9"),
                                "name": "Backend",
                                "description": "monitor_description",
                                "tag": "scrappy-api",
                                "url": "https://scrapyard.johnmgrubbs.io",
                            },
                            UUID("c097ae5c-0bff-4b7d-8396-be8d4607808a"): {
                                "id": UUID("c097ae5c-0bff-4b7d-8396-be8d4607808a"),
                                "name": "google",
                                "description": "monitor_description",
                                "tag": "google",
                                "url": "https://www.google.com"
                            },
                        },
                    },
                    UUID("325ae31b-8a14-4bca-9236-982c34bf90d3"): {
                        "id": UUID("325ae31b-8a14-4bca-9236-982c34bf90d3"),
                        "name": "Development",
                        "description": "environment_description",
                        "monitors": {
                            UUID("d7f00a01-8153-4183-958c-4e940ddef6d2"): {
                                "id": UUID("d7f00a01-8153-4183-958c-4e940ddef6d2"),
                                "name": "Dev Scrappy RAG",
                                "description": "updated_description",
                                "tag": "dev-scrappy",
                                "url": "https://dscrappy.johnmgrubbs.io"
                            },
                            UUID("6094c0a9-62cc-45b4-9afe-22b8ae7b6428"): {
                                "id": UUID("6094c0a9-62cc-45b4-9afe-22b8ae7b6428"),
                                "name": "Dev Scrappy API",
                                "description": "monitor_description",
                                "tag": "dev-scrappy-api",
                                "url": "https://dscrapyard.johnmgrubbs.io",
                            },
                        },
                    },
                }
            },
            UUID("66f401c4-63dc-4506-b396-f86281435db7"): {
                "id": UUID("66f401c4-63dc-4506-b396-f86281435db7"),
                "name": "Vaults",
                "description": "This is an app for managing user profiles across applications.",
                "environments": {
                    UUID("c698dba8-6e73-4cff-9fd6-c57ac98f66f6"): {
                        "id": UUID("c698dba8-6e73-4cff-9fd6-c57ac98f66f6"),
                        "name": "Production",
                        "description": "environment_description",
                        "monitors": {
                            UUID("481ae252-74a8-4e7f-82b9-4ae5af8ace6d"): {
                                "id": UUID("481ae252-74a8-4e7f-82b9-4ae5af8ace6d"),
                                "name": "Frontend",
                                "description": "updated_description",
                                "tag": "vaults",
                                "url": "https://vaults.johnmgrubbs.io",
                            },
                            UUID("343f7dc0-75ff-4dd1-adf2-b987f8b030df"): {
                                "id": UUID("343f7dc0-75ff-4dd1-adf2-b987f8b030df"),
                                "name": "Backend",
                                "description": "monitor_description",
                                "tag": "vaults-api",
                                "url": "https://auth.johnmgrubbs.io",
                            },
                        }
                    },
                    UUID("3b17f522-868e-4a1b-bb3c-d9acf73860cd"): {
                        "id": UUID("3b17f522-868e-4a1b-bb3c-d9acf73860cd"),
                        "name": "Development",
                        "description": "environment_description",
                        "monitors": {
                            UUID("d5b2effb-d964-42ca-b9ff-ccd55429184a"): {
                                "id": UUID("d5b2effb-d964-42ca-b9ff-ccd55429184a"),
                                "name": "Dev Frontend",
                                "description": "updated_description",
                                "tag": "dev-vaults",
                                "url": "https://dvaults.johnmgrubbs.io",
                            },
                            UUID("dfcb122c-5f5e-4013-b013-6ca1f2c09e1e"): {
                                "id": UUID("dfcb122c-5f5e-4013-b013-6ca1f2c09e1e"),
                                "name": "Dev Backend",
                                "description": "monitor_description",
                                "tag": "dev-vaults-api",
                                "url": "https://dauth.johnmgrubbs.io",
                            },
                        }
                    },
                }
            },
            UUID("086bf9b4-bd26-42f3-bc29-9934035247bf"): {
                "id": UUID("086bf9b4-bd26-42f3-bc29-9934035247bf"),
                "name": "Portfolio",
                "description": "This is a project for the Portfolio application. Used to showcase my work.",
                "environments": {
                    UUID("d08a406a-49bb-4f68-a0a5-4bc45cc9e88d"): {
                        "id": UUID("d08a406a-49bb-4f68-a0a5-4bc45cc9e88d"),
                        "name": "Production",
                        "description": "environment_description",
                        "monitors": {
                            UUID("6d22d42c-5cc8-4744-a629-d6eb6dccd3ea"): {
                                "id": UUID("6d22d42c-5cc8-4744-a629-d6eb6dccd3ea"),
                                "name": "Frontend",
                                "description": "updated_description",
                                "tag": "portfolio",
                                "url": "https://portfolio.johnmgrubbs.io",
                            },
                        }
                    },
                    UUID("1d936bee-bd30-406a-a1cf-4aae75f2ee2f"): {
                        "id": UUID("1d936bee-bd30-406a-a1cf-4aae75f2ee2f"),
                        "name": "Development",
                        "description": "environment_description",
                        "monitors": {
                            UUID("18f9e4fc-4f5d-4fdb-9a3b-bf58e69b0db2"): {
                                "id": UUID("18f9e4fc-4f5d-4fdb-9a3b-bf58e69b0db2"),
                                "name": "Dev Frontend",
                                "description": "updated_description",
                                "tag": "dev-portfolio",
                                "url": "https://dportfolio.johnmgrubbs.io",
                            },
                        },
                    },
                }

            },
            UUID("01913c99-a112-4c55-a377-748d7c1aefb3"): {
                "id": UUID("01913c99-a112-4c55-a377-748d7c1aefb3"),
                "name": "Watchtower",
                "description": "This is a project for the Watchtower application. Used to monitor applications and services.",
                "environments": {
                    UUID("04477c6b-4e50-4d39-b057-f551cda6102f"): {
                        "id": UUID("04477c6b-4e50-4d39-b057-f551cda6102f"),
                        "name": "Production",
                        "description": "environment_description",
                        "monitors": {
                            UUID("654bfdf7-4339-48dc-a324-0982c7df640b"): {
                                "id": UUID("654bfdf7-4339-48dc-a324-0982c7df640b"),
                                "name": "Frontend",
                                "description": "updated_description",
                                "tag": "watchtower",
                                "url": "https://watchtower.johnmgrubbs.io",
                            },
                            UUID("f1e90cb2-2010-41a2-a18a-271bf534bec5"): {
                                "id": UUID("f1e90cb2-2010-41a2-a18a-271bf534bec5"),
                                "name": "Backend",
                                "description": "monitor_description",
                                "tag": "watchtower-api",
                                "url": "https://wt-backend.johnmgrubbs.io",
                            },
                        }
                    },
                    UUID("bf2ad38b-de80-403a-a6c9-1c3adb83f081"): {
                        "id": UUID("bf2ad38b-de80-403a-a6c9-1c3adb83f081"),
                        "name": "Development",
                        "description": "environment_description",
                        "monitors": {
                            UUID("986c2af8-b36a-46d5-a694-efcf77b47ff5"): {
                                "id": UUID("986c2af8-b36a-46d5-a694-efcf77b47ff5"),
                                "name": "Dev Frontend",
                                "description": "updated_description",
                                "tag": "dev-watchtower",
                                "url": "https://dwatchtower.johnmgrubbs.io",
                            },
                            UUID("42cc9132-a931-4d69-8203-a4d353919f69"): {
                                "id": UUID("42cc9132-a931-4d69-8203-a4d353919f69"),
                                "name": "Dev Backend",
                                "description": "monitor_description",
                                "tag": "dev-watchtower-api",
                                "url": "https://dwt-backend.johnmgrubbs.io",
                            },
                        }
                    },
                }
            },
        }
    }
}