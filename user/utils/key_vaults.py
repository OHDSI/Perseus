from azure.keyvault.secrets import SecretClient
from azure.identity import DefaultAzureCredential


def get_secrets() -> dict:
    print('Fetch variables from Azure Key Vault')
    kv_endpoint = 'https://kv-perseus.vault.azure.net/'

    credential = DefaultAzureCredential()
    client = SecretClient(vault_url=kv_endpoint, credential=credential)
    config = {
        'DB_NAME': client.get_secret('SharedDbName').value,
        'DB_USER': client.get_secret('SharedDbAuthUser').value,
        'DB_PASSWORD': client.get_secret('SharedDbAuthPass').value,
        'DB_HOST': client.get_secret('SharedDbHost').value,
        'DB_PORT': client.get_secret('SharedDbPort').value
    }
    client.close()

    return config