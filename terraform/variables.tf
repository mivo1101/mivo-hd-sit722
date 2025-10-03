# variables.tf

variable "project_name" {
  description = "The name prefix for all resources"
  type        = string
  default     = "music"
}

variable "location" {
  description = "Azure location for all resources"
  type        = string
  default     = "AustraliaEast"
}

variable "resource_group_name" {
  description = "Resource group name"
  type        = string
  default     = "music-rg"
}

variable "acr_name" {
  description = "Azure Container Registry name"
  type        = string
  default     = "mimusicacr"
}

variable "storage_account_name" {
  description = "Azure Storage Account name"
  type        = string
  default     = "mimusicstorage"
}

variable "storage_container_name" {
  description = "Azure Storage container name"
  type        = string
  default     = "music-container"
}