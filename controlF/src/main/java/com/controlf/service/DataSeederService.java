package com.controlf.service;

import com.controlf.db.repository.*;
import com.controlf.db.schema.*;
import com.controlf.db.schema.enums.EstadoLey;
import com.controlf.db.schema.enums.TipoVoto;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.LocalDate;
import java.util.Arrays;

@Service
@RequiredArgsConstructor
public class DataSeederService {

    private final PoliticoRepository politicoRepository;
    private final UsuarioRepository usuarioRepository;
    private final LeyRepository leyRepository;
    private final VotoRepository votoRepository;
    private final PromesaRepository promesaRepository;

    @Transactional
    public void seed() {
        if (usuarioRepository.count() > 0) return;

        Usuario admin = new Usuario();
        admin.setNombre("Admin");
        admin.setEmail("admin@controlf.com");
        admin.setPasswordHash("admin");
        admin.setAvatarUrl("https://ui-avatars.com/api/?name=Admin");
        admin.setRol(Usuario.Rol.ADMIN);
        admin.setFechaRegistro(LocalDateTime.now());
        usuarioRepository.save(admin);

        Politico p1 = new Politico();
        p1.setNombreCompleto("Juanito Perez");
        p1.setPartidoPolitico("Mov. Transparencia");
        p1.setRegion("Lima");
        p1.setCargoActual("Congresista");
        p1.setPatrimonioDeclarado(new BigDecimal("150000"));
        p1.setFotoUrl("https://ui-avatars.com/api/?name=Juanito+Perez");
        p1.setEstaActivo(true);
        p1.setAntecedentes("Sin antecedentes.");
        p1.setComision("Fiscalización");
        
        Politico p2 = new Politico();
        p2.setNombreCompleto("Maria Garcia");
        p2.setPartidoPolitico("Justicia Social");
        p2.setRegion("Arequipa");
        p2.setCargoActual("Congresista");
        p2.setPatrimonioDeclarado(new BigDecimal("80000"));
        p2.setFotoUrl("https://ui-avatars.com/api/?name=Maria+Garcia");
        p2.setEstaActivo(true);
        p2.setAntecedentes("Reporte de ética 2024.");
        p2.setComision("Salud");

        politicoRepository.saveAll(Arrays.asList(p1, p2));

        Ley l1 = new Ley();
        l1.setCodigo("EXP-2024-001");
        l1.setTitulo("Ley de Transparencia Digital");
        l1.setDescripcionSimplificada("Obliga a entidades públicas a publicar datos en tiempo real.");
        l1.setCategoria("Tecnología");
        l1.setEstado(EstadoLey.APROBADA);
        l1.setFechaIngreso(LocalDate.now());
        l1.setProponente("Comisión de Ciencia");
        l1.setImpactoSocial("Alto impacto en la transparencia.");
        leyRepository.save(l1);

        Voto v1 = new Voto();
        v1.setLey(l1);
        v1.setPolitico(p1);
        v1.setTipoVoto(TipoVoto.FAVOR);
        v1.setAsistencia(true);
        v1.setFechaVoto(LocalDateTime.now());
        votoRepository.save(v1);
    }
}
