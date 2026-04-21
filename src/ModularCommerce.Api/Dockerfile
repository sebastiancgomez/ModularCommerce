# BUILD
FROM mcr.microsoft.com/dotnet/sdk:9.0 AS build
WORKDIR /src

# copiar todo el repo
COPY . .

# restaurar desde la API (resuelve dependencias de toda la solución)
WORKDIR /src/ModularCommerce.Api
RUN dotnet restore

RUN dotnet publish -c Release -o /app/publish

# RUNTIME
FROM mcr.microsoft.com/dotnet/aspnet:9.0
WORKDIR /app

COPY --from=build /app/publish .

EXPOSE 8080

ENTRYPOINT ["dotnet", "ModularCommerce.Api.dll"]