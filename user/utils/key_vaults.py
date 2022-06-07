from azure.identity import ManagedIdentityCredential
from azure.keyvault.secrets import SecretClient


def get_secrets() -> dict:
    print('Fetch variables from Azure Key Vault')
    kv_endpoint = 'https://kv-perseus.vault.azure.net/'

    credential = ManagedIdentityCredential()
    client = SecretClient(vault_url=kv_endpoint, credential=credential)
    config = {
        'DB_NAME': client.get_secret('SharedDbName').value,
        'DB_USER': client.get_secret('SharedDbAuthUser').value,
        'DB_PASSWORD': client.get_secret('SharedDbAuthPass').value,
        'DB_HOST': client.get_secret('SharedDbHost').value,
        'DB_PORT': client.get_secret('SharedDbPort').value,
        'TOKEN_SECRET_KEY': client.get_secret('TokenSecretKey').value,
        'EMAIL_SECRET_KEY': client.get_secret('EmailSecretKey').value,
        'SMTP_SERVER': client.get_secret('SmtpServer').value,
        'SMTP_PORT': client.get_secret('SmtpPort').value,
        'SMTP_EMAIL': client.get_secret('SmtpEmail').value,
        'SMTP_USER': client.get_secret('SmtpUser').value,
        'SMTP_PWD': client.get_secret('SmtpPass').value
    }
    client.close()

    return config