<?php
$pageTitle = "ag-Grid - Styling & Appearance: Animation";
$pageDescription = "Core feature of ag-Grid supporting Angular, React, Javascript and more. One such feature is Animation. Rows in the grid will Animate into place after the user sorts or filters.";
$pageKeyboards = "Javascript Grid Animation";
$pageGroup = "feature";
include '../documentation-main/documentation_header.php';
?>

    <h1>Row Animation</h1>

    <p class="lead">
        Row animations occur after filtering, sorting, resizing height and expanding / collapsing a row group.
        Each on these animations is turned OFF be default. They are all turned on
        using using the property <code>animateRows=true</code>.
    </p>

    <p>
        The grid will animate the rows in the following scenarios:
    </p>

    <ul class="content">
        <li>Column Animations:
            <ul class="content">
                <li>Moving Columns</li>
            </ul>
        </li>
        <li>Row Animations
            <ul class="content">
                <li>Filtering Rows</li>
                <li>Sorting Rows</li>
                <li>Expanding / Collapsing Row Groups</li>
            </ul>
        </li>
    </ul>

    <note>
        Column animations are on by default, row animations are off by default. This is to keep
        with what is expected to be the most common configuration as default.
    </note>

    <p>
        You do not need to know how the animations work, you just need to turn them on. However
        if you are creating a theme or otherwise want to adjust the animations, it will be useful
        for you to understand the sequence of rules which are as follows:
</p>
        <ul class="content">
            <li><b>New Rows:</b> Rows that are new to the grid are placed in the new position and faded in.</li>
            <li><b>Old Rows:</b> Rows that are no longer in the grid are left in the same position and faded out.</li>
            <li><b>Moved Rows:</b> Rows that are in a new position get their position transitioned to the new position.</li>
            <li><b>Resized Height Rows:</b> Rows that get their height change will have the height transitioned to the new height.</li>
        </ul>
<p>
        In addition to the transition animations, old rows are placed behind new rows such that moving rows are
        on top of old rows when moved (hence old rows are not fading out on top of new rows, but behind new rows).
    </p>

    <note>
        Depending on your data set and users, sometimes row animation looks good, sometimes it doesn't.
        A large dataset will not look as nice as a small dataset when sorting and filtering as there will
        be large changes in the rows displayed, sometimes always replacing all the rows. A small dataset
        will look much nicer, especially on that fits all the data on the screen in one go, as then all rows
        will animate to new positions. Users will also have their preference, with users in high pressure
        situations (eg finance traders or air traffic control) may prefer no animation and focus on the data.
    </note>

    <h2>Example Animation</h2>

    <p>
        The example below shows the animations by the JavaScript calling the grid's api. So no touching, just looking!!!
    </p>

    <?= example('Animation', 'animation', 'generated', array("enterprise" => 1, "processVue" => true)) ?>

<?php include '../documentation-main/documentation_footer.php';?>
