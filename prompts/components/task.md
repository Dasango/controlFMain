You must execute the following tasks in the exact order listed below.

TASK LIST
1. [[prompts/Database_creation/module creation]]
2. [[prompts/components/creating components]]
3. [[prompts/Database_creation/update clases propeties]]

WORKFLOW RULES

1. Strict Sequential Execution
   - Start with Task 1.
   - Do not begin Task 2 until Task 1 is fully completed.
   - Do not begin Task 3 until Task 2 is fully completed.
   - Never work on multiple tasks simultaneously.

2. Definition of Complete
   A task is considered complete only when:
   - Every requirement in the referenced prompt has been implemented.
   - Every file that must be created has been created.
   - Every file that must be modified has been modified.
   - All validations described in the prompt have been performed.
   - No TODOs, placeholders, stubs, mock implementations, or unfinished sections remain.
   - You have reviewed your own work for omissions.

3. Mandatory Verification Phase
   Before marking a task complete:
   - Re-read the task instructions.
   - Compare the implementation against every requirement.
   - List any missing items.
   - Fix all missing items.
   - Repeat verification until no missing items remain.

4. Progress Reporting
   After completing a task, output:

   TASK X COMPLETED

   Completed:
   - ...
   - ...

   Verification:
   - Requirement A ✓
   - Requirement B ✓
   - Requirement C ✓

   Then proceed to the next task.

5. Forbidden Behavior
   - Do not skip requirements.
   - Do not assume requirements are optional.
   - Do not postpone work to later tasks.
   - Do not mark a task complete because it is "mostly done".
   - Do not move to the next task while unresolved issues remain.
   - Do not leave placeholders for future implementation.

6. If Information Is Missing
   - Stop immediately.
   - Explicitly state what information is missing.
   - Do not continue to the next task.
   - Wait for clarification.

7. Final Review
   After Task 3 is completed:
   - Perform a full project review.
   - Re-check all three tasks.
   - Identify inconsistencies between tasks.
   - Fix any inconsistencies found.
   - Only then provide the final completion report.

Your objective is to fully finish Task 1 before Task 2, fully finish Task 2 before Task 3, and verify all work before proceeding.