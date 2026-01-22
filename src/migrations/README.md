# Directorio de migraciones

Este directorio contendrá las migraciones de TypeORM cuando se generen.

## Generar una migración

```bash
npm run migration:generate -- src/migrations/NombreDeLaMigracion
```

## Ejecutar migraciones

```bash
npm run migration:run
```

## Revertir última migración

```bash
npm run migration:revert
```

> **Nota**: En desarrollo, `synchronize: true` está activado, por lo que las migraciones no son necesarias.
> En producción, debes usar `synchronize: false` y gestionar cambios mediante migraciones.
