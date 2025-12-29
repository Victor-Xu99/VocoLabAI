from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Application configuration settings"""
    openai_api_key: str
    azure_speech_key: str
    azure_speech_region: str
    frontend_url: str = "http://localhost:3000"
    
    class Config:
        env_file = ".env"


settings = Settings()
