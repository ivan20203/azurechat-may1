

from azure.cosmos import CosmosClient, PartitionKey, exceptions

# Replace the below with your Cosmos DB credentials
AZURE_COSMOSDB_URI="..."
AZURE_COSMOSDB_KEY="..."
database_name = 'chat'
container_name = 'history'

# Create a Cosmos client
client = CosmosClient(AZURE_COSMOSDB_URI, credential=AZURE_COSMOSDB_KEY)

# Connect to database and container
database = client.get_database_client(database_name)
container = database.get_container_client(container_name)

def delete_all_items():
    try:
        # Query to select all items
        item_query = "SELECT * FROM c"
        items = list(container.query_items(
            query=item_query,
            enable_cross_partition_query=True
        ))

        # Delete each item
        for item in items:
            container.delete_item(item['id'], partition_key=item['userId'])
            print(f"Deleted item with id: {item['id']}")

        print("All items deleted successfully.")
    except exceptions.CosmosHttpResponseError as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    delete_all_items()



