# .slc-development notes

# Table Parent ID System

```sql
SELECT
t1.bao00_id AS bam00_bao00_id,
t5.bao00_name_t AS bam00_bao00_bolge,
t4.bao00_name_t AS bam00_bao00_il,
t3.bao00_name_t AS bam00_bao00_ilce,
t2.bao00_name_t AS bam00_bao00_koy,
t1.bao00_name_t AS bam00_bao00_mevkii
FROM bao00 t1
LEFT JOIN bao00 t2 ON t1.bao00_parent = t2.bao00_id
LEFT JOIN bao00 t3 ON t2.bao00_parent = t3.bao00_id
LEFT JOIN bao00 t4 ON t3.bao00_parent = t4.bao00_id
LEFT JOIN bao00 t5 ON t4.bao00_parent = t5.bao00_id
```
