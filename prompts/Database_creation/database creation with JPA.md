you have all the schemas on [[controlF/src/main/java/com/controlf/db/schema/]] 
for example you have [[controlF/src/main/java/com/controlf/db/schema/Usuario.java|Usuario]] schema
```java
package com.controlf.db.schema;

  

import java.time.LocalDateTime;

  

public class Usuario {

  

    private Integer id;

    private String nombre;

    private String email;

    private String passwordHash;

    private Rol rol;

    private LocalDateTime fechaRegistro;

  

    public enum Rol {

        ADMIN,

        VALIDADOR,

        CIUDADANO

    }

}
```
Go to 
