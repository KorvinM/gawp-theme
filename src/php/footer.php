<?php
/**
 * The template for displaying the footer
 *
 * Contains the closing of the #content div and all content after.
 *
 * @link https://developer.wordpress.org/themes/basics/template-files/#template-partials
 *
 * @package Gawp
 */

?>
	</div><!-- #content -->

	<footer id="colophon" class="site-footer flx">
		<div class="site-info">
			<a href="<?php echo esc_url( __( 'https://wordpress.org/', 'gawp' ) ); ?>">
				<?php
				/* translators: %s: CMS name, i.e. WordPress. */
				printf( esc_html__( 'Powered by %s', 'gawp' ), 'WordPress' );
				?>
			</a>
			<span class="sep"> | </span>
				<?php
        $theme = wp_get_theme();
        $themeName = $theme->get( 'Name' );
        $themeAuthor =  $theme->get( 'Author' );
        $themeAuthorUri = $theme->get( 'AuthorURI' );
				printf( esc_html__('%1$s by %2$s', 'gawp' ),
          $themeName . ' Theme', '<a href="'.$themeAuthorUri .'">'.$themeAuthor.'</a>' );
				?>
		</div><!-- .site-info -->
  <div class="notice">
    <?php
    $logoPath = get_template_directory_uri(). "/img/logo.png";
    printf( esc_html__( 'Theme built in %1$s %2$s', 'gawp' ),
      '<img src="'.$logoPath.'" class="logo" alt="Gawp">',//1
      ': free software by <a href="http://korvin.org/">Korvin M Media</a> under
      the terms of the GNU General Public License' )//2
    ;
    ?>
  </div>
	</footer><!-- #colophon -->
</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
