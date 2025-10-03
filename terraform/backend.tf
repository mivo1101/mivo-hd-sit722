terraform {
  backend "azurerm" {
    resource_group_name  = "music-rg"
    storage_account_name = "mimusicstorage"
    container_name       = "tfstate"
    key                  = "terraform.tfstate"
  }
}